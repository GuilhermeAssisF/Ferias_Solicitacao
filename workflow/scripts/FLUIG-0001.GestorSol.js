function GestorSol(){
	
	var cpLoginFluig = hAPI.getCardValue('cpLoginFluig');
	var cpChapaGestor = hAPI.getCardValue('cpChapaGestor');
	if(cpChapaGestor==cpLoginFluig){
		return true;
	}else{
		return false;
	}
}
function verificaPrazo(){
	var cpVerPrazos = hAPI.getCardValue('cpVerPrazos');
	if(cpVerPrazos=="2"){
		return true;
	}else{
		return false;
	}
}