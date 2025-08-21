import {Box, HStack, Input, Portal, Select, Text, NumberInput} from "@chakra-ui/react";
import {alterarAtivoCollection, tipoEmissaoCollection} from "../constants";

export default function Alteracoes({alteracoes, setAlteracoes}) {
    return <Box bg={"white"} p={6} rounded={"lg"} mb={4}>
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
                                    </Select.Item>))}
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
                    onValueChange={(e) => setAlteracoes({...alteracoes, tipoEmissao: e.value})}
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
                                    </Select.Item>))}
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
                    <NumberInput.Input placeholder="Digite"/>
                    <NumberInput.Control/>
                </NumberInput.Root>
            </Box>
        </HStack>
    </Box>;
}