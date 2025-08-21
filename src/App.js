import {
    Box,
    CheckboxCard,
    createListCollection,
    HStack,
    Input,
    Portal,
    Select,
    Text,
    Textarea,
    NumberInput,
    Flex
} from "@chakra-ui/react";
import {useEffect, useState} from "react";

const consolidadoras = [
    "RESERVAFACIL", "DEMO", "INTERNO", "DIRETORIOHOTEL", "TREND", "ESFERA",
    "ESFERAPLUS", "EXPEDIA", "ESFERAFACIL", "TRAVELHUB", "ANCORADOURO",
    "SKYTEAM", "MANUAL", "MANUAL_PEDIDOS_OFF", "EHTL", "CLICKBUS", "GRUPOBRT",
    "CONFIANCA", "EURO_PLUS", "ITERPEC", "CANGOOROO", "COPASTUR", "TYLLER",
    "B2BHOTEL", "WTS", "MOVIDA", "PAYTRACK_GATEWAY", "SAKURA", "HRS", "FLYTOUR",
    "CNTOUR", "LOCALIZA", "OMNIBEES", "FRONTUR", "GOL", "LATAM", "LATAM_NDC",
    "ARBI", "QUEROPASSAGEM", "AZUL", "PRECIFICADOR_VOOS", "OMNIBEES_OPERADORA"
]

const consolidadorasCollection = createListCollection({
    items: consolidadoras.map(c => ({label: c, value: c}))
})

const ativoCollection = createListCollection({
    items: [
        {label: "Todas", value: "todas"},
        {label: "Apenas ativas", value: "ativas"},
        {label: "Apenas desativadas", value: "desativadas"},
    ],
})

const alterarAtivoCollection = createListCollection({
    items: [
        {label: "Não alterar", value: "nao_alterar"},
        {label: "Ativar", value: "ativar"},
        {label: "Desativar", value: "desativar"},
    ],
})

const tipoServicoCollection = createListCollection({
    items: [
        {label: "Taxi", value: 1},
        {label: "Ônibus", value: 2},
        {label: "Devolução PIX", value: 3},
        {label: "Alimentação", value: 4},
        {label: "Aéreo", value: 5},
        {label: "Hotel", value: 6},
        {label: "Carro", value: 7},
        {label: "Quilometragem", value: 8},
        {label: "Combustível", value: 9},
        {label: "Outros", value: 10},
        {label: "Seguro Viagem Carteira Digital", value: 11},
        {label: "Diária", value: 12},
        {label: "Rodoviário", value: 88},
    ],
});

const tipoEmissaoCollection = createListCollection({
    items: [
        {label: "Automática", value: "AUTOMATICO"},
        {label: "Manual", value: "MANUAL"},
        {label: "Sistema externo", value: "SISTEMA_EXTERNO"}
    ],
});

function App() {
    const [filtros, setFiltros] = useState({
        agenciaPaytrack: false,
        nomeAgencia: "",
        agenciaAtiva: "todas",
        credencialAtiva: "todas",
        consolidadora: [],
        tipoServico: [],
        tipoEmissao: [],
        identificador: "",
        nomeTipoPagamento: "",
        dadosCredencial: ""
    });

    const [alteracoes, setAlteracoes] = useState({
        ativo: "nao_alterar", tipoEmissao: "", identificador: "", tipoPagamento: "", aplicarMargem: "nao_alterar", percentualMargem: null
    });

    const [sql, setSql] = useState("");

    useEffect(() => {
        let set = [];
        let where = [];
        let joins = [];

        const precisaJoinAgencia = filtros.agenciaPaytrack === true || filtros.nomeAgencia || filtros.agenciaAtiva !== "todas";
        if (precisaJoinAgencia) joins.push("JOIN $b.agencia a ON a.id_agencia = asv.agencia_id");

        const precisaJoinTipoPagamento = filtros.nomeTipoPagamento || alteracoes.tipoPagamento;
        if (precisaJoinTipoPagamento) joins.push("LEFT JOIN $b.tipo_pagamento tp ON tp.id_tipo_pagamento = asv.id_tipo_pagamento");

        if (filtros.agenciaPaytrack === true) where.push(`a.tipo_agencia = 'PAYTRACK'`);
        if (filtros.nomeAgencia) where.push(`a.nome LIKE '%${filtros.nomeAgencia}%'`);
        if (filtros.agenciaAtiva !== "todas") where.push(`a.ativo = ${filtros.agenciaAtiva === "ativas" ? 1 : 0}`);
        if (filtros.credencialAtiva !== "todas") where.push(`asv.ativo = ${filtros.credencialAtiva === "ativas" ? 1 : 0}`);
        if (filtros.consolidadora.length > 0) where.push(`asv.consolidadora IN (${filtros.consolidadora.join(", ")})`);
        if (filtros.tipoServico.length > 0) where.push(`asv.servico_id IN (${filtros.tipoServico.join(", ")})`);
        if (filtros.tipoEmissao.length > 0) where.push(`asv.tipo_emissao IN (${filtros.tipoEmissao.join(", ")})`);
        if (filtros.identificador) where.push(`asv.identificador LIKE '%${filtros.identificador}%'`);
        if (filtros.dadosCredencial) where.push(`asv.credencial LIKE '%${filtros.dadosCredencial}%'`);
        if (filtros.nomeTipoPagamento) where.push(`tp.nm_forma_pagto = '${filtros.nomeTipoPagamento}'`);

        if (alteracoes.ativo !== "nao_alterar") set.push(`asv.ativo = ${alteracoes.ativo === "ativar" ? 1 : 0}`);
        if (alteracoes.tipoEmissao) set.push(`asv.tipo_emissao = '${alteracoes.tipoEmissao}'`);
        if (alteracoes.identificador) set.push(`asv.identificador = '${alteracoes.identificador}'`);
        if (alteracoes.tipoPagamento) set.push(`asv.id_tipo_pagamento = (SELECT id_tipo_pagamento FROM tipo_pagamento tp WHERE tp.nm_forma_pagto = '${alteracoes.tipoPagamento}' LIMIT 1)`);
        if (alteracoes.aplicarMargem !== "nao_alterar") set.push(`credencial = JSON_SET(credencial, '$.aplicarMargem', ${alteracoes.aplicarMargem === "ativar" ? 1 : 0})`);
        if (alteracoes.percentualMargem !== null) set.push(`credencial = JSON_SET(credencial, '$.percentualMargem', ${alteracoes.percentualMargem})`);

        const sqlLines = [
            "UPDATE $b.agencia_servico asv",
            ...joins,
            `SET ${set.join(", ")}`,
            `WHERE ${where.join(" AND ")};`
        ];

        setSql(sqlLines.join("\n"));
    }, [filtros, alteracoes]);

    return (<Box display="flex" flexDirection="column" p={4} bg={"gray.200"}>
        <Flex align="center" justify="center" my={4}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#0b0b0a" viewBox="0 0 256 256">
                <path d="M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"></path>
            </svg>
            <Text fontSize="xl" ml={2}>
                Gerador de SQL - Alterações de Credenciais Paytrack
            </Text>
        </Flex>

        <Box bg={"white"} p={6} rounded={"lg"} my={4}>
            <Text fontSize={"xl"} mb={4}>
                Condições/Filtros
            </Text>

            <HStack align="stretch" flexWrap="wrap">
                <Box minW="220px" maxW="220px">
                    <CheckboxCard.Root
                        h={"100%"}
                        align={"center"}
                        checked={filtros.agenciaPaytrack}
                        onCheckedChange={(e) => setFiltros({...filtros, agenciaPaytrack: !!e.checked})}
                    >
                        <CheckboxCard.HiddenInput/>
                        <CheckboxCard.Control>
                            <CheckboxCard.Content>
                                <CheckboxCard.Label>
                                    <Text fontWeight={"normal"}>
                                        Apenas agência Paytrack
                                    </Text>
                                </CheckboxCard.Label>
                            </CheckboxCard.Content>
                            <CheckboxCard.Indicator/>
                        </CheckboxCard.Control>
                    </CheckboxCard.Root>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Agências ativas</Text>
                    <Select.Root
                        collection={ativoCollection}
                        size="md"
                        width="220px"
                        onValueChange={(e) => {
                            setFiltros({...filtros, agenciaAtiva: e.value[0]})
                        }}
                    >
                        <Select.HiddenSelect/>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Selecione"/>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator/>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {ativoCollection.items.map((item) => (
                                        <Select.Item item={item} key={String(item.value)}>
                                            {item.label}
                                            <Select.ItemIndicator/>
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Nome da agência (Like)</Text>
                    <Input
                        placeholder={"Digite"} value={filtros.nomeAgencia}
                        onChange={(e) => setFiltros({...filtros, nomeAgencia: e.target.value.trim()})}>
                    </Input>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Credenciais ativas</Text>
                    <Select.Root
                        collection={ativoCollection}
                        size="md"
                        width="220px"
                        onValueChange={(e) => {
                            setFiltros({...filtros, credencialAtiva: e.value[0]})
                        }}
                    >
                        <Select.HiddenSelect/>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Selecione"/>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator/>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {ativoCollection.items.map((item) => (
                                        <Select.Item item={item} key={String(item.value)}>
                                            {item.label}
                                            <Select.ItemIndicator/>
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Consolidadora</Text>
                    <Select.Root
                        multiple
                        collection={consolidadorasCollection}
                        size="md"
                        width="220px"
                        onValueChange={(e) =>
                            setFiltros({...filtros, consolidadora: e.value})
                        }
                    >
                        <Select.HiddenSelect/>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Selecione"/>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator/>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {consolidadorasCollection.items.map(item => (
                                        <Select.Item item={item} key={item.value}>
                                            {item.label}
                                            <Select.ItemIndicator/>
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Serviço</Text>
                    <Select.Root
                        multiple
                        collection={tipoServicoCollection}
                        size="md"
                        width="220px"
                        onValueChange={(e) =>
                            setFiltros({...filtros, tipoServico: e.value})
                        }
                    >
                        <Select.HiddenSelect/>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Selecione"/>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator/>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {tipoServicoCollection.items.map(item => (
                                        <Select.Item item={item} key={item.value}>
                                            {item.label}
                                            <Select.ItemIndicator/>
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Tipo de emissão</Text>
                    <Select.Root
                        multiple
                        collection={tipoEmissaoCollection}
                        size="md"
                        width="220px"
                        onValueChange={(e) =>
                            setFiltros({...filtros, tipoEmissao: e.value})
                        }
                    >
                        <Select.HiddenSelect/>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Selecione"/>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator/>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {tipoEmissaoCollection.items.map(item => (
                                        <Select.Item item={item} key={item.value}>
                                            {item.label}
                                            <Select.ItemIndicator/>
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Identificador (Like)</Text>
                    <Input
                        placeholder={"Digite"} value={filtros.identificador}
                        onChange={(e) => setFiltros({...filtros, identificador: e.target.value.trim()})}>
                    </Input>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Nome do tipo de pagamento</Text>
                    <Input
                        placeholder={"Digite"} value={filtros.nomeTipoPagamento}
                        onChange={(e) => setFiltros({...filtros, nomeTipoPagamento: e.target.value.trim()})}>
                    </Input>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Dados da credencial (Like)</Text>
                    <Input
                        placeholder={"Digite"} value={filtros.dadosCredencial}
                        onChange={(e) => setFiltros({...filtros, dadosCredencial: e.target.value.trim()})}>
                    </Input>
                </Box>
            </HStack>
        </Box>

        <Box bg={"white"} p={6} rounded={"lg"} mb={4}>
            <Text fontSize={"xl"} mb={4}>
                Alterações a serem realizadas
            </Text>

            <HStack spacing={4} align="stretch" flexWrap="wrap">
                <Box minW="220px" maxW="220px">
                    <Text>Ativar/Desativar credencial</Text>
                    <Select.Root
                        collection={alterarAtivoCollection}
                        size="md"
                        width="220px"
                        onValueChange={(e) => {
                            setAlteracoes({...alteracoes, ativo: e.value[0]})
                        }}
                    >
                        <Select.HiddenSelect/>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Selecione"/>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator/>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {alterarAtivoCollection.items.map((item) => (
                                        <Select.Item item={item} key={String(item.value)}>
                                            {item.label}
                                            <Select.ItemIndicator/>
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Tipo de emissão</Text>
                    <Select.Root
                        collection={tipoEmissaoCollection}
                        size="md"
                        width="220px"
                        onValueChange={(e) =>
                            setAlteracoes({...alteracoes, tipoEmissao: e.value})
                        }
                    >
                        <Select.HiddenSelect/>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Selecione"/>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator/>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {tipoEmissaoCollection.items.map(item => (
                                        <Select.Item item={item} key={item.value}>
                                            {item.label}
                                            <Select.ItemIndicator/>
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Identificador</Text>
                    <Input
                        placeholder={"Digite"} value={alteracoes.identificador}
                        onChange={(e) => setAlteracoes({...alteracoes, identificador: e.target.value.trim()})}>
                    </Input>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Nome do tipo de pagamento</Text>
                    <Input
                        placeholder={"Digite"} value={alteracoes.tipoPagamento}
                        onChange={(e) => setAlteracoes({...alteracoes, tipoPagamento: e.target.value.trim()})}>
                    </Input>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Ativar/Desativar margem</Text>
                    <Select.Root
                        collection={alterarAtivoCollection}
                        size="md"
                        width="220px"
                        onValueChange={(e) => {
                            setAlteracoes({...alteracoes, aplicarMargem: e.value[0]})
                        }}
                    >
                        <Select.HiddenSelect/>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Selecione"/>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator/>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {alterarAtivoCollection.items.map((item) => (
                                        <Select.Item item={item} key={String(item.value)}>
                                            {item.label}
                                            <Select.ItemIndicator/>
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Box>
                <Box minW="220px" maxW="220px">
                    <Text>Percentual de margem</Text>
                    <NumberInput.Root
                        value={alteracoes.percentualMargem}
                        min={0}
                        max={100}
                        onValueChange={(value) => {
                            const valor = value.valueAsNumber
                            setAlteracoes({...alteracoes, percentualMargem: Number.isNaN(valor) ? null : valor});
                        }}
                    >
                        <NumberInput.Input placeholder="Digite" />
                        <NumberInput.Control/>
                    </NumberInput.Root>
                </Box>
            </HStack>
        </Box>

        <Box bg={"white"} p={6} rounded={"lg"} mb={4}>
            <Text fontSize={"xl"}>
                Gerador de SQL
            </Text>
            <Textarea mt={4} value={sql} minH="160px" readOnly/>
        </Box>

        <Box bg={"white"} p={6} rounded={"lg"} mb={4}>
            <Text fontSize={"xl"}>
                Como utilizar
            </Text>
            <Box as="ul" listStyleType="circle" mx={6} mt={2}>
                <li>Defina as condições para alterar uma credencial</li>
                <li>Defina as alterações que serão realizadas</li>
                <li>Revise bem o script que foi gerado antes de rodar qualquer coisa em produção, ajuste se for necessário!!!</li>
                <li>Copie o SQL gerado acima e cole no SearchInBases do Paystore</li>
                <li>Selecione o ambiente de produção</li>
                <li>Ative o modo script no canto superior direito</li>
                <li>Execute o script e copie o resultado</li>
                <li>Agora abra a tela de executar SQL no Paystore</li>
                <li>Selecione o ambiente de produção</li>
                <li>Cole os scripts que foram gerados para todas as bases</li>
                <li>Selecione todos e execute (Executar em partes caso seja um script grande)</li>
            </Box>
        </Box>

        <Text ml={2}>
            Criado por Luis Fellipe Amaro :)
        </Text>
    </Box>);
}

export default App;
