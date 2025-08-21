import {useEffect, useState} from "react";

export default function useSql(filtros, alteracoes) {
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

    return { sql };
}