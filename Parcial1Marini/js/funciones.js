//Onload .
window.onload = function () {

    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {

        if (http.readyState == 4 && http.status == 200) {

            var objJson = JSON.parse(http.responseText);

            for (var i = 0; i < objJson.length; i++) {

                agregarTodos(objJson[i].nombre, objJson[i].cuatrimestre, objJson[i].fechaFinal, objJson[i].turno, objJson[i].id);

            }
        }
    }
    http.open("GET", "http://localhost:3000/materias", true)
    http.send();

}
//abrevio
function $(id){
    return document.getElementById(id);
}
//Agregar A la tabla

function agregarTodos(nombre, cuatrimestre, fecha, turno, id) {


    var tCuerpo = $("tCuerpo");

    var tr = document.createElement("tr");

    tr.setAttribute("idMateria", id);

    var td1 = document.createElement("td");
    var nodoTexto = document.createTextNode(nombre);
    td1.appendChild(nodoTexto);
    tr.appendChild(td1);

    var td2 = document.createElement("td");
    var nodoTexto = document.createTextNode(cuatrimestre);
    td2.appendChild(nodoTexto);
    tr.appendChild(td2);

    var td3 = document.createElement("td");
    var nodoTexto = document.createTextNode(fecha);
    td3.appendChild(nodoTexto);
    tr.appendChild(td3);


    var td4 = document.createElement("td");
    var nodoTexto = document.createTextNode(turno);
    td4.appendChild(nodoTexto);
    tr.appendChild(td4);

    tr.addEventListener("dblclick", abrirGrilla)

    tCuerpo.appendChild(tr);



}

//grilla
function abrirGrilla(event) {

    var trClick = event.target.parentNode;

    //busco datos
    var id = trClick.getAttribute("idMateria");
    var nombre = trClick.childNodes[0].innerHTML;
    var cuatrimestre = trClick.childNodes[1].innerHTML;
    var fecha = trClick.childNodes[2].innerHTML;
    var turno = trClick.childNodes[3].innerHTML;

    
    //validación campo turno
    if (turno == "Mañana") {

        $("Tmañana").checked = true;
    } else {
        $("TNoche").checked = true;
    }


    $("nombre").value = nombre;
    $("cuatri").value = cuatrimestre;
    $("cuatri").disabled = true;

    var array = fecha.split('/');
    var fechaFormateada = array[2] + "-" + array[1] + "-" + array[0];

    $("final").value = fechaFormateada;

    $("contGrilla").style.display = "block"

    var btnMod = $("btnModificar");
    var btnDel = $("btnEliminar");
    

    //Modificar
    btnMod.onclick = function () {

        var nuevoNombre = $("nombre").value;
        var nuevaFecha = $("final").value;
        var nuevoTurno = document.querySelector('input[name="turno"]:checked').value;
        
        //Validación campos
        if (validarCampos(nuevoNombre,nuevaFecha)==false) {
            return;
        }

        
        var array = nuevaFecha.split('-');
        var nuevaFechaFormateada = array[2] + "/" + array[1] + "/" + array[0];
        

            var httpPost = new XMLHttpRequest();

            httpPost.onreadystatechange = function () {

                if (httpPost.readyState == 4 && httpPost.status == 200) {
                    $("Cargando").style.display = "none";

                    trClick.childNodes[0].innerHTML = nuevoNombre;



                    trClick.childNodes[2].innerHTML = nuevaFechaFormateada;
                    turno = document.querySelector('input[name="turno"]:checked').value;
                    trClick.childNodes[3].innerHTML = nuevoTurno;
                }
                cerrarGrilla();

            }
      
        httpPost.open("POST", "http://localhost:3000/editar", true)
        httpPost.setRequestHeader("Content-Type", "application/Json");
        $("Cargando").style.display = "flex";
        var JsonMaterias = { "id": id, "nombre": nuevoNombre, "cuatrimestre": cuatrimestre, "fechaFinal": nuevaFechaFormateada, "turno": nuevoTurno };

        httpPost.send(JSON.stringify(JsonMaterias));



    }

    //Eliminar
    btnDel.onclick = function () {


        var httpPost = new XMLHttpRequest();

        httpPost.onreadystatechange = function () {

            if (httpPost.readyState == 4 && httpPost.status == 200) {
                $("Cargando").style.display = "none";

                trClick.removeChild(trClick.childNodes[0]);
                trClick.removeChild(trClick.childNodes[0]);
                trClick.removeChild(trClick.childNodes[0]);
                trClick.removeChild(trClick.childNodes[0]);

            }
            cerrarGrilla();

        }

        httpPost.open("POST", "http://localhost:3000/eliminar", true)
        httpPost.setRequestHeader("Content-Type", "application/Json");
        $("Cargando").style.display = "flex";
        var JsonMaterias = { "id": id };

        httpPost.send(JSON.stringify(JsonMaterias));


    }


}

function cerrarGrilla() {

    $("contGrilla").style.display = "none"

}

//Validaciones

function validarCampos(nom,fec){
    //validar nombre
    if (nom.length <= 6) {
        $("nombre").className="conError";
        alert("El nombre de la materia tiene que tener mas de 6 caracteres.");
        $("nombre").focus();
        

        return false;
    }else{
        $("nombre").className="sinError";
        
    }
    
     //validar fecha
    if (!validarFormatoFecha(fec)) {
        $("final").className="conError";
        alert("Cargue una Fecha valida Formato DD-MM-AAAA!!");
        $("final").focus();
        

        return false;
    }else if (validarFechaMenorActual(fec)) {
        $("final").className="conError";
        alert("Cargue una Fecha que sea mayor a la de hoy");
        $("final").focus();
        

        return false;
    } else {
        $("final").className="sinError";
    }
    

}     


//validar fecha

function validarFormatoFecha(campo) {
    var RegExPattern = /^\d{2,4}\-\d{1,2}\-\d{1,2}$/;
    if ((campo.match(RegExPattern)) && (campo!='')) {
          return true;
    } else {
          return false;
    }
}

function validarFechaMenorActual(date){
    var x=new Date();
    var fecha = date.split("-");
    x.setFullYear(fecha[0],fecha[1]-1,fecha[2]);
    var today = new Date();

    if (x >= today)
      return false;
    else
      return true;
}


