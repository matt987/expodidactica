<?php

class SQLQuery {
    protected $_dbHandle;
    protected $_result;

    /** Connects to database **/

    function connect($address, $account, $pwd, $name) {
        $this->_dbHandle = new mysqli($address, $account, $pwd, $name);
        $this->_dbHandle->set_charset("utf8");

    }

    /** Disconnects from database **/

    function disconnect() {
        if (@mysql_close($this->_dbHandle) != 0) {
            return 1;
        }  else {
            return 0;
        }
    }

    function selectAll() {
    	$query = 'select * from `'.$this->_table.'`';
    	return $this->query($query);
    }

    function select($id) {
    	$query = 'select * from `'.$this->_table.'` where `id` = \''.mysql_real_escape_string($id).'\'';
    	return $this->query($query, 1);
    }

    function find_by($fieldName, $value){
      if (is_array($value)){
        $value = implode(",", $value);
        $query = 'select * from `'.$this->_table.'` where `'.$fieldName.'` in ('.$value.')';
      } elseif (is_int($value)) {
        $query = 'select * from `'.$this->_table.'` where `'.$fieldName.'`= '.$value;
      } else {
        $query = 'select * from `'.$this->_table.'` where `'.$fieldName.'`= \''.$value.'\'';
      }
      return $this->query($query);
    }


    /** Custom SQL Query **/

	function query($query, $singleResult = 0) {
		$this->_result = $this->_dbHandle->query($query);


		if (preg_match("/select/i",$query) and 	$this->_result) {
  		$result = array();
  		$table = array();
      $field = array();
  		$fields = $this->_result->fetch_fields();
  		$tempResults = array();
  		$numOfFields = mysqli_field_count($this->_dbHandle);


      foreach ($fields as $f) {
  		    array_push($table,$f->table);
  		    array_push($field,$f->name);
  		}


#			while ($row = mysql_fetch_row($this->_result)) {
#				for ($i = 0;$i < $numOfFields; ++$i) {
#					$table[$i] = trim(ucfirst($table[$i]),"s");
#					$tempResults[$table[$i]][$field[$i]] = $row[$i];
#				}
#				if ($singleResult == 1) {
#		 			mysql_free_result($this->_result);
#					return $tempResults;
#				}
#				array_push($result,$tempResults);
#			}


      while ($row = mysqli_fetch_array($this->_result)) {
        for ($i = 0;$i < $numOfFields; ++$i) {
          $table[$i] = trim(ucfirst($table[$i]),"s");
          $tempResults[$table[$i]][$field[$i]] = $row[$i];
        }
        if ($singleResult == 1) {
          $this->_result->free();
          return $tempResults;
        }
        array_push($result,$tempResults);
      }


			$this->_result->free();
			return($result);
		}


	}

    /** Get number of rows **/
    function getNumRows() {
        return mysql_num_rows($this->_result);
    }

    /** Free resources allocated by a query **/

    function freeResult() {
        $this->_result->free();
    }

    /** Get error string **/

    function getError() {
        return mysql_error($this->_dbHandle);
    }
}
