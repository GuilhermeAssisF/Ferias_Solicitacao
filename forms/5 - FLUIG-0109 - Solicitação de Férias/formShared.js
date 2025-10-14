$(document).ready(function()
{
	Compartilhados.carregaDescricaoProcesso(Compartilhados.getCodProcess());
	Compartilhados.expandePainel(Compartilhados.getCurrentState());
	Compartilhados.destacaAprovacoes();
	Compartilhados.destacaParecer();
	Compartilhados.camposObrigatorio();
	Compartilhados.carregaManual(Compartilhados.getCodProcess(), "ID_LINK_MANUAL");
	Compartilhados.mostrarReabertura(Compartilhados.getCurrentState(),'2');
	Compartilhados.disableAllButtonZoom();
	
	if (Compartilhados.getCurrentState() == 0 && $("#cpSolicitanteNome").val() == '')
	{
		$("#cpSolicitanteNome").val(FLUIGC.sessionStorage.getItem('userInformation').values[0].NOME);
		$("#cpSolicitanteFuncao").val(FLUIGC.sessionStorage.getItem('userInformation').values[0].FUNCAO);
		$("#cpSolicitanteEmpresa").val(FLUIGC.sessionStorage.getItem('userInformation').values[0].EMPRESA);
		$("#cpSolicitanteObraDep").val(FLUIGC.sessionStorage.getItem('userInformation').values[0].SECAO);
		$("#cpSolicitanteEmail").val(FLUIGC.sessionStorage.getItem('userInformation').values[0].EMAIL);
		$("#cpSolicitanteEstado").val(FLUIGC.sessionStorage.getItem('userInformation').values[0].ESTADO);

		$("#cpMatriculaSolicitante").val(Compartilhados.getUserCode());
		$("#cpDataAbertura").val(Compartilhados.GetDateNow());
	}

});
