import {Box, CheckboxCard, HStack, Input, Portal, Select, Text} from "@chakra-ui/react";
import {ativoCollection, consolidadorasCollection, tipoEmissaoCollection, tipoServicoCollection} from "../constants";

export default function Filtros({filtros, setFiltros}) {
    return <Box bg={"white"} p={6} rounded={"lg"} my={4}>
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
                                {ativoCollection.items.map((item) => (<Select.Item item={item} key={String(item.value)}>
                                        {item.label}
                                        <Select.ItemIndicator/>
                                    </Select.Item>))}
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
                                {ativoCollection.items.map((item) => (<Select.Item item={item} key={String(item.value)}>
                                        {item.label}
                                        <Select.ItemIndicator/>
                                    </Select.Item>))}
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
                    onValueChange={(e) => setFiltros({...filtros, consolidadora: e.value})}
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
                                {consolidadorasCollection.items.map(item => (<Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator/>
                                    </Select.Item>))}
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
                    onValueChange={(e) => setFiltros({...filtros, tipoServico: e.value})}
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
                                {tipoServicoCollection.items.map(item => (<Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator/>
                                    </Select.Item>))}
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
                    onValueChange={(e) => setFiltros({...filtros, tipoEmissao: e.value})}
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
                                {tipoEmissaoCollection.items.map(item => (<Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator/>
                                    </Select.Item>))}
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
    </Box>;
}