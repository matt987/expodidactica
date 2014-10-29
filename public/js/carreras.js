var config = {
  url: "http://localhost/expodidactica-final/carreras/getCarreras",
  posiciones: ["derecha","izquierda"],
  contenedorCarreras:"#carreras-container",
  contenedorCombo:"#contenedor-combo"
}

function Carrera(nombre, descripcion, charlas){
  this.nombre = nombre;
  this.descripcion = descripcion;
  this.charlas = charlas;
}

function Charla(nombre, descripcion, horario){
  this.nombre = nombre;
  this.descripcion = descripcion;
  this.fecha = new Date(horario.split(" ").join("T"));
  var minutos = (this.fecha.getMinutes() === 0) ? "00" : this.fecha.getMinutes();
  this.horario = this.fecha.getHours() + ":" + minutos;
  console.log(this.horario);
}


function traerObjetos(url, callback){
  var carreras = [];
  $.ajax({
    type: 'GET',
    url: url,
    beforeSend: function(){
    },
    success: function (data) {
      data = JSON.parse(data);
      carreras = inicializar(data);
      callback(carreras);

    }
  });
}

function inicializar(objetos){
  var carreras = [];
  for(var i in objetos){
    var objeto = objetos[i];
    //console.log(objeto);
    var charlas = [];
    for(var j in objeto.charlas){
      var charla = objeto.charlas[j];
      if (charla){
          charlas.push(new Charla(charla['nombre'], charla['descripcion'], charla['fecha']));
      }
    }
    carreras.push(new Carrera(objeto['nombre'], objeto['descripcion'], charlas));

  }
  console.log(carreras);
  return carreras;

}

function pintarPagina(carreras){
  var buffer = [];
  pintarCombo(carreras);
  for (var i in carreras){
    var carrera = carreras[i];
    buffer.push(componente(carrera, i%2));
  }
  $(config['contenedorCarreras']).html(buffer.join(""));
}

function pintarCombo(carreras){
    var buffer = [];
    buffer.push('<div class="btn-group dropdown">');
    buffer.push('  <button class="btn btn-custom btn-lg dropdown-toggle" type="button" data-toggle="dropdown">');
    buffer.push('    Carreras <span class="caret"></span>');
    buffer.push('  </button>');
    buffer.push('  <ul class="dropdown-menu" role="menu" style="z-index:99">');
    for (var i in carreras){
      var carrera = carreras[i];
      buffer.push('  <li><a href="#' + removerEspacios(carrera.nombre) + '">' + carrera.nombre + '</a></li>');
    }
    buffer.push('  </ul>');
    buffer.push('</div>');
    $(config['contenedorCombo']).html(buffer.join(""));
}


function componente(carrera, posicion){
  var buffer = [];
  if (posicion === 0){
    buffer.push('<div class="row oscuro" id="' + removerEspacios(carrera.nombre) + '">');
    buffer.push(    descripcionComponente(carrera.nombre, carrera.descripcion));
    buffer.push(    horariosComponente(carrera.charlas, "oscuro"));
    buffer.push('</div>');
  }else {
    buffer.push('<div class="row claro"  id="' + removerEspacios(carrera.nombre) + '">');
    buffer.push(    horariosComponente(carrera.charlas, "claro"));
    buffer.push(    descripcionComponente(carrera.nombre, carrera.descripcion));
    buffer.push('</div>');
  }
  return buffer.join("");
}

function horariosComponente(charlas, clase){
  var buffer = [];
  buffer.push('<div class="horario col-md-6 nano">');
  buffer.push('  <div class="nano-content">');
  buffer.push(     listaHoras(charlas));
  buffer.push(     listaLinea(charlas.length, clase));
  buffer.push(     listaDescripcion(charlas));
  buffer.push('  </div>');
  buffer.push('<div class="nano-pane""><div class="nano-slider" style="height: 35px; transform: translate(0px, 197.432496447181px);"></div></div>')
  buffer.push('</div>');
  return buffer.join("");
}

function listaHoras(charlas){
  var buffer = [];
  buffer.push('<ul class="hora">');
  for (var i in charlas){
    var hora = charlas[i].horario;
    buffer.push('<li>' + hora + '</li>');
  }
  buffer.push('</ul>');
  return buffer.join("");
}

function listaLinea(cantidad, clase){
  var buffer = [];
  buffer.push('<ul class="linea">')  ;
  for(var i=0; i < cantidad; i++){
    buffer.push('<li><span class="' + clase + '"></span></li>');
  }
  buffer.push('</ul>');
  return buffer.join("");
}

function listaDescripcion(charlas){
  var buffer = [];
  buffer.push('<ul class="horario-descripcion">');
  for (var i in charlas){
    var charla = charlas[i];
    buffer.push('<li>');
    buffer.push(charla.nombre);
    buffer.push('<span>' + charla.descripcion + '</span>')
    buffer.push('</li>');
  }
  buffer.push('</ul>');
  return buffer.join("");
}

function descripcionComponente(titulo, subtitulo, descripcion){
  var buffer = [];
  buffer.push('<div class="carrera-descripcion col-md-6">');
  buffer.push('  <h3>' + titulo + '</h3>');
  buffer.push('  <span>' + subtitulo + '</span>');
  buffer.push('  <p>' + descripcion + '</p>');
  buffer.push('</div>');
  return buffer.join("");
}

function removerEspacios(cadena){
  return cadena.replace(/\s/g,'').toLowerCase();
}

$(document).ready(function(){
  var carreras = traerObjetos(config['url'], pintarPagina);
  $(".nano").nanoScroller();
});
