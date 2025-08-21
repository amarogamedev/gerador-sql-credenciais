import {Box, CheckboxCard, createListCollection, HStack, Input, Portal, Select, Text, Textarea} from "@chakra-ui/react";
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
    items: consolidadoras.map(c => ({ label: c, value: c }))
})

const ativoCollection = createListCollection({
    items: [
        { label: "Todas", value: "todas" },
        { label: "Apenas ativas", value: "ativas" },
        { label: "Apenas desativadas", value: "desativadas" },
    ],
})

const tipoServicoCollection = createListCollection({
    items: [
        { label: "Taxi", value: 1 },
        { label: "Ônibus", value: 2 },
        { label: "Devolução PIX", value: 3 },
        { label: "Alimentação", value: 4 },
        { label: "Aéreo", value: 5 },
        { label: "Hotel", value: 6 },
        { label: "Carro", value: 7 },
        { label: "Quilometragem", value: 8 },
        { label: "Combustível", value: 9 },
        { label: "Outros", value: 10 },
        { label: "Seguro Viagem Carteira Digital", value: 11 },
        { label: "Diária", value: 12 },
        { label: "Rodoviário", value: 88 },
    ],
});

const tipoEmissaoCollection = createListCollection({
    items: [
        { label: "Automática", value: "AUTOMATICO" },
        { label: "Manual", value: "MANUAL" },
        { label: "Sistema externo", value: "SISTEMA_EXTERNO" }
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
        loginOuSenha: ""
    });

    const [alteracoes, setAlteracoes] = useState({
        ativo: null, tipoEmissao: "", identificador: "", tipoPagamento: "", aplicarMargem: null, porcentagemMargem: ""
    });

    const [sql, setSql] = useState("");

    useEffect(() => {
        let where = ["a.tipo = 'PAYTRACK'"];
        if (filtros.agenciaPaytrack === true) where.push(`a.tipo_agencia = 'PAYTRACK'`);
        if (filtros.nomeAgencia) where.push(`a.nome LIKE '%${filtros.nomeAgencia}%'`);
        if (filtros.agenciaAtiva !== "todas") where.push(`a.ativo = ${filtros.agenciaAtiva === "ativas" ? 1 : 0}`);
        if (filtros.credencialAtiva !== "todas") where.push(`asv.ativo = ${filtros.credencialAtiva === "ativas" ? 1 : 0}`);
        if (filtros.consolidadora.length > 0) where.push(`asv.consolidadora IN (${filtros.consolidadora.join(", ")})`);
        if (filtros.tipoServico.length > 0) where.push(`asv.servico_id IN (${filtros.tipoServico.join(", ")})`);
        if (filtros.tipoEmissao.length > 0) where.push(`asv.tipo_emissao IN (${filtros.tipoEmissao.join(", ")})`);
        if (filtros.identificador) where.push(`asv.identificador LIKE '%${filtros.identificador}%'`);
        if (filtros.nomeTipoPagamento) where.push(`tp.nm_forma_pagto LIKE '%${filtros.nomeTipoPagamento}%'`);
        if (filtros.loginOuSenha) where.push(`asv.credencial LIKE '%${filtros.loginOuSenha}%'`);

        let setParts = [];
        if (alteracoes.ativo !== null) setParts.push(`asv.ativo = ${alteracoes.ativo ? 1 : 0}`);
        if (alteracoes.tipoEmissao) setParts.push(`asv.tipo_emissao = '${alteracoes.tipoEmissao}'`);
        if (alteracoes.identificador) setParts.push(`asv.identificador = '${alteracoes.identificador}'`);
        if (alteracoes.tipoPagamento) setParts.push(`asv.id_tipo_pagamento = (SELECT id_tipo_pagamento FROM tipo_pagamento tp WHERE tp.nm_forma_pagto = '${alteracoes.tipoPagamento}')`);
        if (alteracoes.aplicarMargem !== null) setParts.push(`asv.aplicar_margem = ${alteracoes.aplicarMargem ? 1 : 0}`);
        if (alteracoes.porcentagemMargem) setParts.push(`asv.porcentagem_margem = ${alteracoes.porcentagemMargem}`);

        const sqlLines = [
            "UPDATE agencia_servico asv",
            "JOIN agencia a ON a.id_agencia = asv.agencia_id",
            "LEFT JOIN tipo_pagamento tp ON tp.id_tipo_pagamento = asv.id_tipo_pagamento",
            `SET ${setParts.join(", ")}`,
            `WHERE ${where.join(" AND ")};`
        ];
        const sqlText = sqlLines.join("\n");
        setSql(sqlText);
    }, [filtros, alteracoes]);

    function Divider() {
        return <Box height="1px" bg="gray.300" my={4}/>;
    }

    return (<Box display="flex" flexDirection="column" p={4}>
        <Text fontSize="xl" fontWeight={"bold"} my={6} textAlign="center">
            Gerador de SQL - Alterações de Credenciais Paytrack
        </Text>

        <Text fontSize={"xl"}>
            Condições/Filtros
        </Text>
        <Divider/>
        <HStack spacing={4} align="stretch">
            <Box>
                <CheckboxCard.Root
                    h={"100%"}
                    align={"center"}
                    checked={filtros.agenciaPaytrack}
                    onCheckedChange={(e) => setFiltros({ ...filtros, agenciaPaytrack: !!e.checked })}
                >
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control>
                        <CheckboxCard.Content>
                            <CheckboxCard.Label>
                                <Text fontWeight={"normal"}>
                                    Apenas agência Paytrack
                                </Text>
                            </CheckboxCard.Label>
                        </CheckboxCard.Content>
                        <CheckboxCard.Indicator />
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
            </Box>
            <Box>
                <Text>Agências ativas</Text>
                <Select.Root
                    collection={ativoCollection}
                    size="md"
                    width="250px"
                    onValueChange={(e) => {
                        setFiltros({...filtros, agenciaAtiva: e.value[0]})
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Selecione" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {ativoCollection.items.map((item) => (
                                    <Select.Item item={item} key={String(item.value)}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Box>
            <Box>
                <Text>Nome da agência (Like)</Text>
                <Input
                    placeholder={"Nome da agência"} value={filtros.nomeAgencia}
                    onChange={(e) => setFiltros({...filtros, nomeAgencia: e.target.value.trim()})}>
                </Input>
            </Box>
            <Box>
                <Text>Credenciais ativas</Text>
                <Select.Root
                    collection={ativoCollection}
                    size="md"
                    width="250px"
                    onValueChange={(e) => {
                        setFiltros({...filtros, credencialAtiva: e.value[0]})
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Selecione" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {ativoCollection.items.map((item) => (
                                    <Select.Item item={item} key={String(item.value)}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Box>
            <Box>
                <Text>Consolidadora</Text>
                <Select.Root
                    multiple
                    collection={consolidadorasCollection}
                    size="md"
                    width="320px"
                    onValueChange={(e) =>
                        setFiltros({ ...filtros, consolidadora: e.value })
                    }
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Selecione consolidadoras" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {consolidadorasCollection.items.map(item => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Box>
            <Box>
                <Text>Serviço</Text>
                <Select.Root
                    multiple
                    collection={tipoServicoCollection}
                    size="md"
                    width="320px"
                    onValueChange={(e) =>
                        setFiltros({ ...filtros, tipoServico: e.value })
                    }
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Selecione os tipos de serviço" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {tipoServicoCollection.items.map(item => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Box>
            <Box>
                <Text>Tipo de emissão</Text>
                <Select.Root
                    multiple
                    collection={tipoEmissaoCollection}
                    size="md"
                    width="320px"
                    onValueChange={(e) =>
                        setFiltros({ ...filtros, tipoEmissao: e.value })
                    }
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Selecione os tipos de emissão" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {tipoEmissaoCollection.items.map(item => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Box>
        </HStack>

        <Divider/>
        <Text fontSize={"xl"}>
            Alterações a serem realizadas
        </Text>
        <Divider/>
        <Text fontSize={"xl"}>
            Gerador de SQL
        </Text>
        <Textarea mt={4} value={sql} h="60vh" readOnly/>
    </Box>);
}

export default App;
