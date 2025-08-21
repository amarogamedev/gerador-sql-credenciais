import {createListCollection} from "@chakra-ui/react";

export const consolidadoras = [
    "RESERVAFACIL", "DEMO", "INTERNO", "DIRETORIOHOTEL", "TREND", "ESFERA",
    "ESFERAPLUS", "EXPEDIA", "ESFERAFACIL", "TRAVELHUB", "ANCORADOURO",
    "SKYTEAM", "MANUAL", "MANUAL_PEDIDOS_OFF", "EHTL", "CLICKBUS", "GRUPOBRT",
    "CONFIANCA", "EURO_PLUS", "ITERPEC", "CANGOOROO", "COPASTUR", "TYLLER",
    "B2BHOTEL", "WTS", "MOVIDA", "PAYTRACK_GATEWAY", "SAKURA", "HRS", "FLYTOUR",
    "CNTOUR", "LOCALIZA", "OMNIBEES", "FRONTUR", "GOL", "LATAM", "LATAM_NDC",
    "ARBI", "QUEROPASSAGEM", "AZUL", "PRECIFICADOR_VOOS", "OMNIBEES_OPERADORA"
]

export const consolidadorasCollection = createListCollection({
    items: consolidadoras.map(c => ({label: c, value: c}))
})

export const ativoCollection = createListCollection({
    items: [
        {label: "Todas", value: "todas"},
        {label: "Apenas ativas", value: "ativas"},
        {label: "Apenas desativadas", value: "desativadas"},
    ],
})

export const alterarAtivoCollection = createListCollection({
    items: [
        {label: "Não alterar", value: "nao_alterar"},
        {label: "Ativar", value: "ativar"},
        {label: "Desativar", value: "desativar"},
    ],
})

export const tipoServicoCollection = createListCollection({
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

export const tipoEmissaoCollection = createListCollection({
    items: [
        {label: "Automática", value: "AUTOMATICO"},
        {label: "Manual", value: "MANUAL"},
        {label: "Sistema externo", value: "SISTEMA_EXTERNO"}
    ],
});
