<?php

class CarrerasController extends Controller {


    function index(){

    }

    function getCarreras(){
        $carreras = $this->Carrera->selectAll();
        $materiaObject = new Materia;
        $charlaObject = new Charla;
        $array = [];
        foreach ($carreras as $carrera){
          $carrera = $carrera['Carrera'];
          $materia_ids = [];
          $array_materias = [];
          $array_charlas = [];

          $materias = $materiaObject->find_by('carrera_id', intval($carrera['id']));
          foreach ($materias as $materia){
            $array_materias[$materia['Materia']['id']] = $materia['Materia'];
            array_push($materia_ids, intval($materia['Materia']['id']));
          }
          $charlas = $charlaObject->find_by('materia_id', $materia_ids);
          foreach ((array)$charlas as $charla){
            $charla = $charla['Charla'];
            $charla['materia'] = $array_materias[$charla['materia_id']];
            array_push($array_charlas, $charla);
          }
          $carrera['charlas'] = $array_charlas;
          array_push($array, $carrera);
        }
        echo json_encode($array);
    }

    function view($id = null,$name = null) {

        $this->set('title',$name.' - Carreras');
        $this->set('carrera',$this->Carrera->select($id));

    }

    function viewall() {

        $this->set('title','Todas las carreras');
        $this->set('carreras',$this->Carrera->selectAll());
    }

    function add() {
        $todo = $_POST['todo'];
        $this->set('title','Success - My Todo List App');
        $this->set('carreras',$this->Carrera->query('insert into carreras (nombre) values (\''.mysql_real_escape_string($carrera).'\')'));
    }

    function delete($id = null) {
        $this->set('title','Success - My Todo List App');
        $this->set('carreras',$this->Carrera->query('delete from carreras where id = \''.mysql_real_escape_string($id).'\''));
    }

}
