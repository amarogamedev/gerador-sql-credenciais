import {Box, Text} from "@chakra-ui/react";
import {useState} from "react";
import useSql from "./hooks/useSql";
import ComoUsar from "./components/ComoUsar";
import GeradorSql from "./components/GeradorSql";
import Titulo from "./components/Titulo";
import Filtros from "./components/Filtros";
import Alteracoes from "./components/Alteracoes";

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
        ativo: "nao_alterar",
        tipoEmissao: "",
        identificador: "",
        tipoPagamento: "",
        aplicarMargem: "nao_alterar",
        percentualMargem: null
    });

    const { sql } = useSql(filtros, alteracoes);

    return (<Box display="flex" flexDirection="column" p={4} bg={"gray.200"}>
        <Titulo/>
        <Filtros filtros={filtros} setFiltros={setFiltros} />
        <Alteracoes alteracoes={alteracoes} setAlteracoes={setAlteracoes} />
        <GeradorSql value={sql}/>
        <ComoUsar/>
        <Text ml={2}>
            Criado por Luis Fellipe Amaro :)
        </Text>
    </Box>);
}

export default App;
