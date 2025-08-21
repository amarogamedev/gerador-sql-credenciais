import {Box, Text, Textarea, Switch, Flex} from "@chakra-ui/react";

export default function GeradorSql(props) {
    return <Box bg={"white"} p={6} rounded={"lg"} mb={4}>
        <Flex gap={3}>
            <Text fontSize={"xl"}>
                Gerador de SQL - {props.acao}
            </Text>
            <Switch.Root onCheckedChange={props.handleChangeAcao}>
                <Switch.HiddenInput />
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label />
            </Switch.Root>
        </Flex>
        <Textarea mt={4} value={props.value} minH="160px" readOnly/>
    </Box>;
}