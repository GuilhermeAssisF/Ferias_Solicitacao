var INTEGRACAO = 83; //INTEGRA NA ATIVIDADE 24 DE apos o PROCESSAMENTO DE FERIAS
var ATIVIDADE_GERAR_KIT = 90; // GERAR KIT FERIAS (BPO)
var ATIVIDADE_VALIDAR_KIT_RH = 153; // VALIDAR KIT FERIAS (RH)

function beforeStateEntry(sequenceId){

	var atividadeAnterior = getValue("WKPrevState"); // Pega a atividade de onde o fluxo está vindo
	
	if(sequenceId==INTEGRACAO){
		CadastraFerias();
	}

	// Verifica se está entrando na atividade de Gerar Kit Férias (BPO)
    if (sequenceId == ATIVIDADE_GERAR_KIT) {
        log.info("--- [FLUIG-0001] Entrando na atividade Gerar Kit Férias (90) ---");

        // Verifica se a flag 'Kit Férias' já está marcada (indicando um retorno para correção)
        // Checkboxes marcados geralmente têm o valor "on" no servidor.
        var flagKitFeriasAtual = hAPI.getCardValue("cpFlagKitFerias");
        log.info("--- [FLUIG-0001] Valor atual cpFlagKitFerias: '" + flagKitFeriasAtual + "'");

        if (flagKitFeriasAtual == "on") {
            log.info("--- [FLUIG-0001] Desmarcando cpFlagKitFerias devido ao retorno para correção. Processo: " + getValue("WKNumProces"));
            // Define o valor do campo como vazio ("") para desmarcar o checkbox
            hAPI.setCardValue("cpFlagKitFerias", "");
        }
    }

}

function CadastraFerias() {

    log.info("--- [FLUIG-0001] Iniciando CadastraFerias ---"); // Adicionado Log
    var retorno = true;
    var xml;

    var formatoInput = new java.text.SimpleDateFormat("dd/MM/yyyy");
    var formatoOutput = new java.text.SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");

    var xmlFerias = "";

    // Pega valores do formulário
    var InicioFerias = hAPI.getCardValue("cpDataInicioFerias");
    var FimFerias = hAPI.getCardValue("cpDataFimFerias");
    var Dtpagto = hAPI.getCardValue("cpDtPagto");
    var FimPerAqui = hAPI.getCardValue("cpFimPeriodoAquisitivo");
    var chapa = hAPI.getCardValue("cpMatricula");
    var Coligada = hAPI.getCardValue("cpColigada");
    var DiasFerias = hAPI.getCardValue("cpDiasFerias"); // Pega o valor atual
    var Abono = hAPI.getCardValue("cpDiasAbono");
    var HaveraAbono = hAPI.getCardValue("cpHaveraAbono"); // Pega o tipo de abono ('1', '2' ou '3')
    var Antecipar13Salario = hAPI.getCardValue("cpAntecipar13Salario");

    // Variáveis para datas formatadas - inicializar como null
    var DtinicioFormatada2 = null;
    var DtFimFormatada2 = null;
    var DtPagamentoFormatada2 = null;
    var DtFimAquiFormatada2 = null;
    var DTAvisoFer2 = null;

    // Define a flag 'somenteAbono'
    var somenteAbono = (HaveraAbono == '3'); // Verifica se é Somente Abono

    log.info("Tipo Abono (HaveraAbono): " + HaveraAbono + ", Somente Abono: " + somenteAbono);

    try {
        // --- Processa datas que SEMPRE são necessárias (Pagamento e Fim Aquisitivo) ---
        // DATA DE PAGAMENTO
        if (Dtpagto != null && Dtpagto != "") {
            var DtPagamento = formatoInput.parse(Dtpagto); // Parse DENTRO do IF
            var DtPagamentoFormatada = formatoOutput.format(DtPagamento);
            DtPagamentoFormatada2 = DtPagamentoFormatada.replace("T12", "T00");
            log.info("Ferias DtPagamentoFormatada2: " + DtPagamentoFormatada2);
        } else {
            log.warn("Data de Pagamento (Dtpagto) está vazia.");
            // Não precisa lançar erro aqui, mas a variável será null
        }

        // fim de periodo aquisitivo
        if (FimPerAqui != null && FimPerAqui != "") {
            var DtFimAqui = formatoInput.parse(FimPerAqui); // Parse DENTRO do IF
            var DtFimAquiFormatada = formatoOutput.format(DtFimAqui);
            DtFimAquiFormatada2 = DtFimAquiFormatada.replace("T12", "T00");
            log.info("Ferias DtFimAquiFormatada2: " + DtFimAquiFormatada2);
        } else {
            log.warn("Fim Período Aquisitivo (FimPerAqui) está vazio.");
            // Não precisa lançar erro aqui, mas a variável será null
        }

        // --- Processa datas de gozo e aviso APENAS SE NÃO FOR Somente Abono ---
        if (!somenteAbono) {
            log.info("Não é 'Somente Abono'. Processando datas de Início, Fim e Aviso.");
            // início de ferias
            if (InicioFerias != null && InicioFerias != "") {
                var DtInicio = formatoInput.parse(InicioFerias); // Parse DENTRO do IF
                var DtinicioFormatada = formatoOutput.format(DtInicio);
                DtinicioFormatada2 = DtinicioFormatada.replace("T12", "T00");
                log.info("Ferias DtinicioFormatada2: " + DtinicioFormatada2);

                // DATA DO AVISO DE FERIAS (Só calcula se tiver Data Início)
                // Usar Calendar para subtrair dias é mais seguro
                var cal = java.util.Calendar.getInstance();
                cal.setTime(DtInicio);
                cal.add(java.util.Calendar.DAY_OF_MONTH, -30); // Subtrai 30 dias
                var dataAvisoCalculada = cal.getTime();
                var DTAvisoFer = formatoOutput.format(dataAvisoCalculada);
                DTAvisoFer2 = DTAvisoFer.replace("T12", "T00");
                log.info("Ferias DTAvisoFer2 (Calculada): " + DTAvisoFer2);

            } else {
                log.warn("Data Início Férias (InicioFerias) está vazia (e não é Somente Abono).");
                // DtinicioFormatada2 e DTAvisoFer2 permanecerão null
            }

            // fim de ferias
            if (FimFerias != null && FimFerias != "") {
                var DtFim = formatoInput.parse(FimFerias); // Parse DENTRO do IF
                var DtFimFormatada = formatoOutput.format(DtFim);
                DtFimFormatada2 = DtFimFormatada.replace("T12", "T00");
                log.info("Ferias DtFimFormatada2: " + DtFimFormatada2);
            } else {
                log.warn("Data Fim Férias (FimFerias) está vazia (e não é Somente Abono).");
                // DtFimFormatada2 permanecerá null
            }
        } else {
            // --- LÓGICA PARA Somente Abono ---
            log.info("É 'Somente Abono'. Definindo DiasFerias como 0.");
            DiasFerias = "0"; // Garante que DiasFerias seja 0 para o XML
            // As variáveis DtinicioFormatada2, DtFimFormatada2, DTAvisoFer2 já são null por padrão
        }

    } catch (dateError) {
        log.error("Erro ao formatar datas em CadastraFerias: " + dateError);
        // Lança uma exceção mais clara para o Fluig
        throw "Erro ao processar as datas informadas (" + dateError.message + "). Verifique os formatos (dd/MM/yyyy).";
    }

    // Define flags booleanas/numéricas
    var temAbono = (HaveraAbono == '1' || HaveraAbono == '3') ? "1" : "0"; // Correto: 1 se for Sim ou Somente Abono
    var Antecipar13 = (Antecipar13Salario == '1' && !somenteAbono) ? "1" : "0"; // Correto: 1 só se for Sim e não for Somente Abono

    // preenche dados de ferias
    xmlFerias += ' <PFUFeriasPer>';
    xmlFerias += '<CODCOLIGADA>' + Coligada + '</CODCOLIGADA>';
    xmlFerias += ' <CHAPA>' + chapa + '</CHAPA>';
    // Adiciona as tags apenas se a data formatada não for nula
    if (DtFimAquiFormatada2 != null) xmlFerias += '<FIMPERAQUIS>' + DtFimAquiFormatada2 + '</FIMPERAQUIS>'; else log.warn("XML: Omitindo FIMPERAQUIS (data vazia)");
    if (DtPagamentoFormatada2 != null) xmlFerias += '<DATAPAGTO>' + DtPagamentoFormatada2 + '</DATAPAGTO>'; else log.warn("XML: Omitindo DATAPAGTO (data vazia)");
    if (DtinicioFormatada2 != null) xmlFerias += '<DATAINICIO>' + DtinicioFormatada2 + '</DATAINICIO>'; else log.info("XML: Omitindo DATAINICIO (Somente Abono ou data vazia)");
    if (DtFimFormatada2 != null) xmlFerias += '<DATAFIM>' + DtFimFormatada2 + '</DATAFIM>'; else log.info("XML: Omitindo DATAFIM (Somente Abono ou data vazia)");
    if (DTAvisoFer2 != null) xmlFerias += '<DATAAVISO>' + DTAvisoFer2 + '</DATAAVISO>'; else log.info("XML: Omitindo DATAAVISO (Somente Abono ou data vazia)");
    xmlFerias += '<SITUACAOFERIAS>M</SITUACAOFERIAS>'; // Marcada
    xmlFerias += ' <NRODIASFERIAS>' + (DiasFerias != null ? DiasFerias : "0") + '</NRODIASFERIAS>'; // Usa o valor ajustado (0 para Somente Abono)
    xmlFerias += '<NRODIASABONO>' + (Abono != null ? Abono : "0") + '</NRODIASABONO>'; // Usa 0 se Abono for null/vazio
    xmlFerias += '<NRODIASFERIASCORRIDOS>0.00</NRODIASFERIASCORRIDOS>'; // Verificar se precisa ser diferente
    xmlFerias += '<NRODIASABONOCORRIDOS>0.00</NRODIASABONOCORRIDOS>'; // Verificar se precisa ser diferente
    xmlFerias += '<POSICAOABONO>' + temAbono + '</POSICAOABONO>';
    xmlFerias += '<IMAGEMSITUACAO>Marcadas</IMAGEMSITUACAO>';
    xmlFerias += '<PAGA1APARC13O>' + Antecipar13 + '</PAGA1APARC13O>';
    xmlFerias += '</PFUFeriasPer>';

    log.info("@xmlFerias diz: xmlFerias Montado: " + xmlFerias);

    // Conexão e chamada do Web Service (mantido igual)
    var CONNECT = DatasetFactory.getDataset("ds_connector", null, null, null);
    // ... (resto da configuração do WS) ...
    var USUARIO = CONNECT.getValue(0,"INTEGRADOR");
	var SENHA = CONNECT.getValue(0, "SENHA");
	var NOME_SERVICO = "WSDATASERVER";
	var CAMINHO_SERVICO = "com.totvs.WsDataServer";

	var servico = ServiceManager.getServiceInstance(NOME_SERVICO);

	var serviceHelper = servico.getBean();
	var instancia = servico.instantiate(CAMINHO_SERVICO);

	var ws = instancia.getRMIwsDataServer();

	var authenticatedService = serviceHelper.getBasicAuthenticatedClient(ws, "com.totvs.IwsDataServer", USUARIO, SENHA);


    try {
        var result = authenticatedService.saveRecordEmail('FopFuFeriasPerDataBR', xmlFerias, 'CODCOLIGADA=' + Coligada + ';CODSISTEMA=P', "suportesoter@consultoriainterativa.com.br");
        log.info("@xmlFerias Cadastro diz: RESULT: " + result);

        if ((result != null) && (result.indexOf("===") != -1)) {
            var msgErro = result.substring(0, result.indexOf("==="));
            log.error("Erro retornado pelo Web Service RM: " + msgErro);
            throw msgErro;

        } else {
             log.info("Web Service RM executado sem retornar erro explícito.");
        }
    } catch (e) {
        if (e == null) {
            e = "Erro desconhecido; verifique o log do AppServer";
        }
        var mensagemErro = "Falha na comunicação/execução do Web Service RM: " + e;
        log.error(mensagemErro + " ---> XML enviado: " + xmlFerias);
        throw mensagemErro; // Lança a exceção para o Fluig
    }

    log.info("--- [FLUIG-0001] Finalizando CadastraFerias com sucesso ---"); // Adicionado Log
    return retorno; // Retorna true se não houve exceção
}