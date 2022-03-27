
//selectores
const Body=document.querySelector("body")
let form;
let buscador;
let resultado;
let BtnBuscar;



document.addEventListener("DOMContentLoaded",CargarHtmlDom)


$(document).ready(function() {
    $('.js-example-basic-single').select2({
      placeholder: "Selecciona la ciudad",
      allowClear: true
    });
  });

  //referenciA SELECTORES
  setTimeout(function() {
    form=document.querySelector("#formulario")
    buscador=document.querySelector("#buscar")
    resultado=document.querySelector("#resultado")
    BtnBuscar=document.querySelector("#BtnBuscar")

    form.addEventListener("submit",BuscarClima)
  },10)

  

function CargarHtmlDom(){
    Body.innerHTML=` <div class="container-fluid">

    <div class="row">
        <div class="col-sm-4"></div>
        <div class="col-sm-4">
   
            <h2 class="mt-4">Busca el clima en las Capitales del Mundo</h2>
   
            <form id="formulario" class="mt-1">
             
                <label for="validationTooltip04" class="form-label mt-3"><strong>Buscar Ciudad</strong></label>
                <select class="js-example-basic-single form-control" style="width: 50%" name="buscar" id="buscar">
                  <option value=""></option>
                </select>
   
                <input type="submit" class="btn btn-primary rounded mt-2" id="BtnBuscar" value="Buscar"/>
   
            </form>
   
        </div>
        <div class="col-sm-4"></div>
   
    </div>
   
    <div class="row mt-3">
   
        <div class="col-sm-4"></div>
        <div class="col-sm-4" id="resultado">
   
   
        </div>
        <div class="col-sm-4"></div>
    </div>
   
   
   </div>  `
   
}
CargarCiudadesCapitales()

function CargarCiudadesCapitales(){

    fetch("listaCapitales.json")
    .then(respuesta=>respuesta.json())
    .then(resultado=>LlenarSelectBuscador(resultado))
}

function LlenarSelectBuscador(lista){

for(const x in lista){

  const select=document.createElement('option')
if(lista[x]!==""){

  select.value=x
  select.textContent=lista[x]
  buscador.appendChild(select)
  //console.log(`Code Pais: ${x} ciudad: ${lista[x]}`)
}

   
}


}

function BuscarClima(e){
e.preventDefault()

const Info={
code:"",
ciudad:""

}
  Info.code=buscador.value
  Info.ciudad=buscador.options[buscador.selectedIndex].text

  const {code,ciudad}=Info

  if(code==="" || ciudad ===""){

    swal({
      title: "Atencion!",
      text: "Todos los campos son obligatorios!",
      icon: "error",
    });
    
  return;
  }

  console.log(Info)

  ConsultarApiClima(code,ciudad)
  
}

function ConsultarApiClima(cod,ciudad){

  const odioma="sp"
  const ApiId="b573caa41e60f9673a631570de8dc783"
  const Url=`https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${cod}&appid=${ApiId}&lang=${odioma}`
  limpiarHtml()
  fetch(Url)
  .then(response => response.json())
  .then(resultado => {

    if(resultado.cod ==="404"){
      swal({
        title: "Atencion!",
        text: "La ciudad no existe!",
        icon: "error",
      });
      return;
    }

    MostrarClimaHtml(resultado)
  })

  
}

function MostrarClimaHtml(resultadoApi) {

  const {main:{temp, temp_max,temp_min},name,weather}=resultadoApi

  let CieloActual;
  const TemperatureActual=KelvinACentigrados(temp)
  const TemperatureMax=KelvinACentigrados(temp_max)
  const TemperatureMin=KelvinACentigrados(temp_min)

  weather.forEach(clim => CieloActual=clim.description)

  const div=document.createElement('div')
  const div2=document.createElement('div')
  div2.classList.add("fs-5","fw-bold","mt-1","text-center")
  div.classList.add("fs-2","fw-bold","mt-1","text-center")

  const CiudadParrafo=document.createElement('p')
  const cieloActual=document.createElement('p')
  const TempActualParrafo=document.createElement('p')
  const TempMinParrafo=document.createElement('p')
  const TempMaxParrafo=document.createElement('p')

  CiudadParrafo.innerHTML=`Ciudad de ${name}`
  cieloActual.innerHTML=`${CieloActual}`
  TempActualParrafo.innerHTML=` Actual ${TemperatureActual} °C`
  TempMinParrafo.innerHTML=`Minimo ${TemperatureMin} °C`
  TempMaxParrafo.innerHTML=`Maximo ${TemperatureMax} °C`
  
  div.appendChild(CiudadParrafo)
  div2.appendChild(cieloActual)
 div2.appendChild(TempActualParrafo)
 div2.appendChild(TempMinParrafo)
 div2.appendChild(TempMaxParrafo)

 resultado.appendChild(div)
  resultado.appendChild(div2)

}

const KelvinACentigrados= grados => parseInt(grados-273.15) 

function limpiarHtml(){
while(resultado.firstChild){
  resultado.removeChild(resultado.firstChild)
}

}










