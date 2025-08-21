import {Box, Text} from "@chakra-ui/react";

export default function ComoUsar(props) {
    return <Box bg={"white"} p={6} rounded={"lg"} mb={4}>
        <Text fontSize={"xl"}>
            Como utilizar
        </Text>
        <Box as="ul" listStyleType="circle" mx={6} mt={2}>
            <li>Defina as condições para alterar uma credencial</li>
            <li>Defina as alterações que serão realizadas</li>
            <li>Revise bem o script que foi gerado antes de rodar qualquer coisa em produção, ajuste se for
                necessário!!!
            </li>
            <li>Copie o SQL gerado acima e cole no SearchInBases do Paystore</li>
            <li>Selecione o ambiente de produção</li>
            {props.acao === "UPDATE" && <li>Ative o modo script no canto superior direito</li>}
            <li>Execute o script e copie o resultado</li>
            {props.acao === "UPDATE" && (
                <>
                    <li>Agora abra a tela de executar SQL no Paystore</li>
                    <li>Selecione o ambiente de produção</li>
                    <li>Cole os scripts que foram gerados para todas as bases</li>
                    <li>Selecione todos e execute (Executar em partes caso seja um script grande)</li>
                </>
            )}
        </Box>
    </Box>;
}