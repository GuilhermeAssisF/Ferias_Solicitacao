function displayFields(form, customHTML) {

	log.info("INICIO do DISPLAY do formulário FLUIG-0001 - FERIAS");
	var atividade = parseInt(getValue("WKNumState"));

	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);

	customHTML.append("<script>function getAtividade(){ return " + getValue("WKNumState") + "; }</script>");
	customHTML.append("<script>function getFormMode(){ return '" + form.getFormMode() + "'; }</script>");
	customHTML.append("<script>function getServerTime(){ return " + (new Date().getTime()) + "; }</script>");
	customHTML.append("<script>function getUser() { return '" + getValue("WKUser") + "'; }</script>");


	if ((form.getFormMode() != "VIEW") && (atividade == 0 || atividade == 4)) {



		var hoje = new Date(),
			dia = hoje.getDate(),
			mes = hoje.getMonth() + 1;

		if (dia < 10) {
			dia = '0' + dia;
		}

		if (mes < 10) {
			mes = '0' + mes;
		}


		form.setValue("cpDataAbertura", dia + '/' + mes + '/' + hoje.getFullYear());

		var filterColaborador = new java.util.HashMap(),
			dadosColaborador,
			loginColaborador,
			DadosSolicitante;

		filterColaborador.put("colleaguePK.colleagueId", getValue("WKUser"));
		dadosColaborador = getDatasetValues('colleague', filterColaborador);
		loginColaborador = new Array(dadosColaborador.get(0).get("login"));

		DadosSolicitante = DatasetFactory.getDataset("DS_FLUIG_0006", loginColaborador, null, null);

		//DADOS DO SOLICITANTE
		form.setValue('cpLoginFluig', dadosColaborador.get(0).get("login"));
		form.setValue('cpNomeSolicitante', DadosSolicitante.getValue(0, "NOME"));
		form.setValue('cpMatriculaSolicitante', DadosSolicitante.getValue(0, "CHAPA"));
		form.setValue('cpEmailSolicitante', dadosColaborador.get(0).get("mail"));
		form.setValue('cpFuncaoSolicitante', DadosSolicitante.getValue(0, "CARGO"));
		form.setValue('cpEmpresaSolicitante', DadosSolicitante.getValue(0, "NOMEFANTASIA"));
		form.setValue('cpDepartamentoObraSolicitante', DadosSolicitante.getValue(0, "SECAO"));
		form.setValue('cpSolicitanteColigada', DadosSolicitante.getValue(0, "CODCOLIGADA"));
		form.setValue('cpEstadoSolicitante', DadosSolicitante.getValue(0, "UF_SECAO"));


	}

	if (atividade == "14") {
		filter = new java.util.HashMap();
		filter.put("colleaguePK.colleagueId", getValue("WKUser"));
		var colaborador = getDatasetValues('colleague', filter);
		form.setValue('cpNomeAprovador', colaborador.get(0).get("colleagueName"));
	}

	if (atividade == "20") {
		filter = new java.util.HashMap();
		filter.put("colleaguePK.colleagueId", getValue("WKUser"));
		var colaborador = getDatasetValues('colleague', filter);
		form.setValue('cpNomeAprovador2', colaborador.get(0).get("colleagueName"));
	}
	if (atividade == "93") {
		filter = new java.util.HashMap();
		filter.put("colleaguePK.colleagueId", getValue("WKUser"));
		var colaborador = getDatasetValues('colleague', filter);
		form.setValue('cpNomeConfKit', colaborador.get(0).get("colleagueName"));
	}
	if (atividade == "153" || atividade == "136") {
		filter = new java.util.HashMap();
		filter.put("colleaguePK.colleagueId", getValue("WKUser"));
		var colaborador = getDatasetValues('colleague', filter);
		form.setValue('cpNomeAprovador3', colaborador.get(0).get("colleagueName"));
	}

	// Adicione esta condição para a Atividade 90
	if (atividade == 90) {
		// Define o valor do checkbox 'cpFlagCadastro' como 'on' (marcado)
		form.setValue("cpFlagCadastro", "on");
		// Ou, dependendo da implementação exata do checkbox no HTML:
		// form.setValue("cpFlagCadastro", true);
	}



	log.info("INICIO do DISPLAY do formulário FLUIG-0001 - FERIAS");


	//tratativa para problemas das datas


	var InicioFerias = form.getValue("cpDataInicioFerias");
	var Dtpagto = form.getValue("cpDataInicioFerias");
	var FimFerias = form.getValue("cpDataFimFerias");
	var InicioPerAqui = form.getValue("cpInicioPeriodoAquisitivo");
	var FimPerAqui = form.getValue("cpFimPeriodoAquisitivo");


	var arrayCamposData = [InicioFerias, Dtpagto, FimFerias, InicioPerAqui, FimPerAqui];
	function CorrecaoDatas(form, arrayCamposData) {
		for (var i = 0; i < arrayCamposData.length; i++) {
			var dataAtual = form.getValue(arrayCamposData[i]);
			if (dataAtual != "") {
				form.setValue(arrayCamposData[i], AjustarData(dataAtual));
			}
		}
	}

	function AjustarData(data) {

		if (data == "") {
			return "";
		};
		if (data.indexOf("-") > -1) {
			return data.split("-")[2] + "/" + data.split("-")[1] + "/" + data.split("-")[0];
		}
		return data;
	}


	//tratativa para problemas das datas

	var InicioFerias = form.getValue("cpDataInicioFerias");
	var Dtpagto = form.getValue("cpDtPagto");
	var FimFerias = form.getValue("cpDataFimFerias");
	var InicioPerAqui = form.getValue("cpInicioPeriodoAquisitivo");
	var FimPerAqui = form.getValue("cpFimPeriodoAquisitivo");
	var DataAdmissao = form.getValue("cpDataAdmissao");
	var DtNascimento = form.getValue("cpDtNascimento");
	var DataAbertura = form.getValue("cpDataAbertura");


	var formatoInput = new java.text.SimpleDateFormat("yyyy-MM-dd");
	var formatoOutput = new java.text.SimpleDateFormat("dd/MM/yyyy");

	if (InicioFerias.search('-') > 0) {
		var DtmudancaForm = formatoInput.parse(InicioFerias);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('cpDataInicioFerias', dtAtualFormatado);
	} if (Dtpagto.search('-') > 0) {
		var DtmudancaForm = formatoInput.parse(Dtpagto);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('cpDtPagto', dtAtualFormatado);
	} if (FimFerias.search('-') > 0) {
		var DtmudancaForm = formatoInput.parse(FimFerias);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('cpDataFimFerias', dtAtualFormatado);
	} if (InicioPerAqui.search('-') > 0) {
		var DtmudancaForm = formatoInput.parse(InicioPerAqui);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('cpInicioPeriodoAquisitivo', dtAtualFormatado);
	} if (FimPerAqui.search('-') > 0) {
		var DtmudancaForm = formatoInput.parse(FimPerAqui);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('cpFimPeriodoAquisitivo', dtAtualFormatado);
	} if (DataAdmissao.search('-') > 0) {
		var DtmudancaForm = formatoInput.parse(DataAdmissao);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('cpDataAdmissao', dtAtualFormatado);
	} if (DtNascimento.search('-') > 0) {
		var DtmudancaForm = formatoInput.parse(DtNascimento);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('cpDtNascimento', dtAtualFormatado);
	} if (DataAbertura.search('-') > 0) {
		var DtmudancaForm = formatoInput.parse(DataAbertura);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('cpDataAbertura', dtAtualFormatado);
	}







}

