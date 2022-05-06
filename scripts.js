// 1)Clases: Implementar la siguiente jerarquía de clases en JS. Usar Herencia.

//Punto 3 - Herencia de clases
class Persona{

    constructor(id, dni, apellido, nombre){
        this._id = parseInt(id);
        this._dni = parseInt(dni);
        this._apellido = apellido;
        this._nombre = nombre;
    } 

    get id(){return this._id;}
    get dni(){return this._dni;}
    get apellido(){return this._apellido;}
    get nombre(){return this._nombre;}

    set id(val){this._id = parseInt(val);}
    set dni(val){this._dni = parseInt(val);}
    set apellido(val){this._apellido = val}
    set nombre(val){this._nombre = val;}

    toString() {
        return this.id + " - " + this.dni + " - " + this.apellido + ", "+this.nombre;
    } 
}

class Alumno extends Persona{
    constructor(id, dni, apellido, nombre, cursoLetra, cursoNumero){
        super(id, dni, apellido, nombre);
        this._cursoLetra = cursoLetra;
        this._cursoNumero = parseInt(cursoNumero);
    }

    get cursoLetra(){return this._cursoLetra;}
    get cursoNumero(){return this._cursoNumero;}

    set cursoLetra(val){this._cursoLetra = val;}
    set cursoNumero(val){this._cursoNumero = parseInt(val);}


    toString() {
        return super.toString() + " - " + this.cursoLetra + " - " + this.cursoNumero;
    }
}

class Docente extends Persona{
    constructor(id, dni, apellido, nombre, materia, año){
        super(id, dni, apellido, nombre);
        this._materia = materia;
        this._año = parseInt(año);    
    }

    get materia(){return this._materia;}
    get año(){return this._año;}

    set materia(val){this._materia = val;}
    set año(val){this._año = parseInt(val);}

    toString() {
        return super.toString() + " - " + this.materia + " -  $" + this.año;
    }
}


//2)Dada la siguiente cadena de caracteres, generar un Array de objetos de la jerarquía del punto 1. 
let json = '[{"id":1,"dni":17663295,"nombre":"FABIAN MARCELO","apellido":"ABADIE","cursoNumero":1,"cursoLetra":"F"},{"id":2,"dni":38724762,"nombre":"MAIRA DAIANA","apellido":"ABALOS","cursoNumero":3,"cursoLetra":"M"},{"id":3,"dni":25447357,"nombre":"NOELIA LIDIA","apellido":"ABBA","cursoNumero":2,"cursoLetra":"N"},{"id":4,"dni":27577699,"nombre":"MARÍA SOLEDAD","apellido":"ACHOR","cursoNumero":2,"cursoLetra":"M"},{"id":900,"dni":11496581,"nombre":"JOSE MIGUEL","apellido":"ARMALEO","materia":"Fisica","año":1},{"id":899,"dni":35326658,"nombre":"ROSA DEL VALLE","apellido":"LOPEZ","materia":"Lengua","año":3},{"id":898,"dni":39638351,"nombre":"DANIELA BELEN","apellido":"BROGGI D`ATENA","materia":"Matematica","año":3},{"id":897,"dni":17275566,"nombre":"PABLO ALBERTO","apellido":"ALMEIDA","materia":"Quimica","año":1}]'
let array = JSON.parse(json);
let arrayPersonas = jsonAObjetos(array);

console.log(arrayPersonas);

function jsonAObjetos(arrayObjetos){
    return arrayObjetos.map((elemActual)=>{
        if(elemActual.hasOwnProperty('cursoNumero')){
            elemActual = new Alumno(elemActual.id,elemActual.dni,elemActual.apellido,elemActual.nombre,elemActual.cursoLetra,elemActual.cursoNumero);
        }else if(elemActual.hasOwnProperty('materia')){
            elemActual = new Docente(elemActual.id,elemActual.dni, elemActual.apellido,elemActual.nombre,elemActual.materia,elemActual.año);
        }
        return elemActual;
    });
}


//Elementos HTML
const form = document.getElementById("formPersonas");
const selectForm = document.getElementById('selectTipo');
const selectFiltrado = document.getElementById("selectFiltrado");
const tabla = document.getElementById("tabla");
const tbody = document.getElementById("tbody");
 
//Eventos
cargarDatosTabla(arrayPersonas);

selectForm.addEventListener("change", ocultarInputs);

document.getElementById("agregarButton").addEventListener("click", ()=>{
    resetearFormulario();
    form.style.display="grid";
    document.getElementById("nuevoButton").style.display="block";
    document.getElementById("modificarButton").style.display="none";
    document.getElementById("eliminarButton").style.display="none";
});

document.getElementById("cancelarButton").addEventListener("click", ()=>{
    resetearFormulario();
    form.style.display="none";
});

document.getElementById("nuevoButton").addEventListener("click", ()=>{
    agregarRegistro();    
});

document.getElementById("modificarButton").addEventListener("click", ()=>{
    const idRegistro= document.getElementById("inputId").value;
    modificarRegistro(idRegistro);
});

document.getElementById("eliminarButton").addEventListener("click", ()=>{
    const idRegistro= document.getElementById("inputId").value;
    eliminarRegistro(idRegistro);
});

document.getElementById("promedioButton").addEventListener("click", ()=>{
    let promedio = calcularPromedio();
    document.getElementById("inputPromedio").value = promedio;
});

//Agrega eventos a las filas de la tabla
for(let f of document.getElementsByClassName('registro')){ 
    /*Al hacer doble click sobre una fila, debe visualizarse el formulario del 
    punto 4 con los datos de la fila elegida.*/
    f.addEventListener('dblclick', () =>{
        for(let i=0; i<arrayPersonas.length; i++){
            if(f.id == arrayPersonas[i].id){
                form.style.display="grid";
                cargarDatos(arrayPersonas[i]);
            }
        }
        document.getElementById("nuevoButton").style.display="none";
        document.getElementById("modificarButton").style.display="block";    
        document.getElementById("eliminarButton").style.display="block";
    });
}

//Los encabezados de la tabla deben ser botones y cuando se apreta el botón se ordena la tabla en base a ese criterio.
for(let boton of document.getElementsByClassName('botonTitulo')){
    boton.addEventListener('click', () =>{
        cargarDatosTabla(ordenarLista(arrayPersonas,boton.id));
    });
}

/*Cada Checkbox corresponde a una columna (todas empiezan seleccionadas), al deseleccionar una, debe ocultarse la columna 
correspondiente de la tabla y al seleccionarse nuevamente debe visualizarse.*/
for(let cb of document.getElementsByClassName('cbTitulo')){
    cb.addEventListener('change', e =>{
        columna=document.getElementsByClassName(e.target.value);
        console.log(columna);
        if(e.target.checked == true){
            for(let e of columna){
                e.style.display="";
            }
        }else{
            for(let e of columna){
                e.style.display="none";
            }   
        }
        columna=null;
    });
}

//Filtra la lista segun el criterio seleccionado
selectFiltrado.addEventListener('change', e =>{
    let lista = null;
    console.log(arrayPersonas);
    switch(e.target.selectedIndex){
        case 0:
            lista = arrayPersonas;
            break;
        case 1:
            lista = arrayPersonas.filter(v => v instanceof Alumno);
            break;
        case 2:
            lista = arrayPersonas.filter(v => v instanceof Docente);
            break;
    }
    document.getElementById("inputPromedio").value="";
    resetearFormulario();
    cargarDatosTabla(lista);
    return lista;
});

//Funciones
//Carga los registros en el body de la tabla, según los datos del array pasado por parámetro
function cargarDatosTabla(arrayPersonas){
    form.style.display="none";
    let tablaBody = document.getElementById("tablaBody");
    vaciarTabla();

    if(arrayPersonas!=null){
        for(let element of arrayPersonas){
            let registro = document.createElement('tr');
            registro.id=element.id;
            registro.className="registro";

            let id = document.createElement('th');
            id.className="colId";
            let dni = document.createElement('th');
            dni.className="colDni";
            let apellido = document.createElement('th');
            apellido.className="colApellido";
            let nombre = document.createElement('th');    
            nombre.className="colNombre";
            let letraCurso = document.createElement('th');
            letraCurso.className="colLetra";
            let numeroCurso = document.createElement('th');    
            numeroCurso.className="colNumero";
            let materia = document.createElement('th');
            materia.className="colMateria";
            let año = document.createElement('th');            
            año.className="colAnio";


            id.innerHTML = element.id;
            dni.innerHTML = element.dni;
            nombre.innerHTML = element.nombre;
            apellido.innerHTML = element.apellido;

            if(element instanceof Alumno){
                letraCurso.innerHTML = element.cursoLetra;
                numeroCurso.innerHTML = element.cursoNumero;
            }else if(element instanceof Docente){
                materia.innerHTML = element.materia;
                año.innerHTML = element.año;
            }

            registro.appendChild(id);
            registro.appendChild(dni);
            registro.appendChild(apellido);
            registro.appendChild(nombre);
            registro.appendChild(numeroCurso);
            registro.appendChild(letraCurso);
            registro.appendChild(materia);   
            registro.appendChild(año);   
            tablaBody.appendChild(registro);
        }
    }
}

//Agrega un registro a la lista
function agregarRegistro(){
    let id = parseInt(form["inputId"].value);
    let dni = form["inputDni"].value;
    let nombre = form["inputNombre"].value;
    let apellido = form["inputApellido"].value;
    if(selectForm.selectedIndex==0){
        let cursoLetra = form["inputLetraCurso"].value;
        let cursoNumero = parseInt(form["inputNumCurso"].value);
        let alumno = new Alumno(id,dni,apellido,nombre,cursoLetra,cursoNumero);
        arrayPersonas.push(alumno);
        console.log(alumno.toString());
    }else{
        let año = parseInt(form["inputAnio"].value);
        let materia = form["inputMateria"].value;
        let docente = new Docente(id,dni,apellido,nombre,materia,año);
        arrayPersonas.push(docente);
        console.log(docente.toString());
    }
    cargarDatosTabla(arrayPersonas);
    resetearFormulario();
}

//Modifica un registro existente en la lista
function modificarRegistro(idRegistro){
    for(let x of arrayPersonas){
        if(idRegistro==x.id){
            x.dni=form["inputDni"].value;
            x.nombre=form["inputNombre"].value;
            x.apellido=form["inputApellido"].value;
            if(x instanceof Alumno){
                x.cursoNumero = parseInt(form["inputNumCurso"].value);
                x.cursoLetra = form["inputLetraCurso"].value;
            }else{
                x.año = parseInt(form["inputAnio"].value);
                x.materia = form["inputMateria"].value;        
            }
        }
    }
    cargarDatosTabla(arrayPersonas);
    resetearFormulario();
}

//Elimina un registro de la lista
function eliminarRegistro(idRegistro){
    let tbody = document.getElementById('tablaBody');
    for(let i=0; i<arrayPersonas.length;i++){
        if(idRegistro==arrayPersonas[i].id){
            arrayPersonas.splice(i, 1);
            let registro = document.getElementById(String(idRegistro));
            tbody.removeChild(registro);
        }
    }
    resetearFormulario();
    cargarDatosTabla(arrayPersonas);
}

//Ordena la lista según un criterio pasado por parámetro
function ordenarLista(array, criterio){
    switch(criterio){
        case 'id':
            return array.sort((a,b)=> a.id - b.id);
        case 'dni':
            return array.sort((a,b)=> a.dni - b.dni);    
        case 'nombre':
            return array.sort((a,b)=> a.nombre.localeCompare(b.nombre));
        case 'apellido':
            return array.sort((a,b)=>  a.apellido.localeCompare(b.apellido));
        case 'numeroCurso':
            return array.filter(e=>e instanceof Alumno).sort((a,b)=> a.cursoNumero - b.cursoNumero);
        case 'letraCurso':
            return array.filter(e=>e instanceof Alumno).sort((a,b)=> a.cursoLetra.localeCompare(b.cursoLetra));
        case 'año':
            return array.filter(e=>e instanceof Docente).sort((a,b)=> a.año - b.año);
        case 'materia':
            return array.filter(e=>e instanceof Docente).sort((a,b)=> a.materia.localeCompare(b.materia));
    }
}

//Carga los datos de una persona en el form
function cargarDatos(persona){
    form.selectTipo.disabled=true;
    form.inputId.value=persona.id;
    form.inputDni.value=persona.dni;
    form.inputApellido.value=persona.apellido;
    form.inputNombre.value=persona.nombre;

    if(persona instanceof Alumno){
        form.selectTipo.selectedIndex=0;
        form.inputNumCurso.value=persona.cursoNumero;
        form.inputLetraCurso.value=persona.cursoLetra;
    }else{
        form.selectTipo.selectedIndex=1;
        form.inputMateria.value=persona.materia;
        form.inputAnio.value=persona.año;
    }
    mostrarTodosLosBotones();
    ocultarInputs();

}

//Resetea el formulario y oculta inputs segun se trate de un Cliente o un Empleado
function resetearFormulario(){
    form.reset();
    let ultimoId = arrayPersonas.reduce((acc,item) =>Math.max(acc, parseInt(item.id)),0);
    form.inputId.value = ultimoId + 1;
    form.selectTipo.disabled=false;
    form.selectTipo.selectedIndex=0;
    ocultarInputs();
}

//Oculta inputs segun el tipo de registro
function ocultarInputs(){
    if(selectForm.selectedIndex==0){
        document.getElementById("labelNumCurso").style.display="block";
        form.inputNumCurso.style.display="block";
        document.getElementById("labelLetraCurso").style.display="block";
        form.inputLetraCurso.style.display="block"; 
        document.getElementById("labelAnio").style.display="none";
        form.inputAnio.style.display="none";  
        document.getElementById("labelMateria").style.display="none";
        form.inputMateria.style.display="none";  
    }else{
        document.getElementById("labelNumCurso").style.display="none";
        form.inputNumCurso.style.display="none";
        document.getElementById("labelLetraCurso").style.display="none";
        form.inputLetraCurso.style.display="none"; 
        document.getElementById("labelAnio").style.display="block";
        form.inputAnio.style.display="block";  
        document.getElementById("labelMateria").style.display="block";
        form.inputMateria.style.display="block"; 
    }
}

//Elimina todos los registros de la tabla
function vaciarTabla(){
    while (tablaBody.firstChild) {
        tablaBody.removeChild(tablaBody.firstChild);
    }   
}

function mostrarTodosLosBotones(){
    for(let b of document.getElementsByClassName("botonTitulo")){
        b.style.display="block";
    }
}

function calcularPromedio(){
    let lista=null;
    let suma=0;
    switch(selectFiltrado.selectedIndex){
        case 0:
            lista = arrayPersonas;
            suma = lista.reduce((a, next) => a + (next.dni || 0), 0); 
            return parseFloat(suma / array.length);
        case 1:
            lista = arrayPersonas.filter(v => v instanceof Alumno);
            suma = lista.reduce((a, next) => a + (next.dni || 0), 0); 
            return parseFloat(suma / array.length);
        case 2:
            lista = arrayPersonas.filter(v => v instanceof Docente);
            suma = lista.reduce((a, next) => a + (next.dni || 0), 0); 
            return parseFloat(suma / array.length);
    }

}