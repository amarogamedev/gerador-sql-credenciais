import {Box, Text, Textarea} from "@chakra-ui/react";

export default function GeradorSql(props) {
    return <Box bg={"white"} p={6} rounded={"lg"} mb={4}>
        <Text fontSize={"xl"}>
            Gerador de SQL
        </Text>
        <Textarea mt={4} value={props.value} minH="160px" readOnly/>
    </Box>;
}