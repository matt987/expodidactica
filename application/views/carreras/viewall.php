<form action="../carreras/add" method="post">
<input type="text" value="I have to..." onclick="this.value=''" name="todo"> <input type="submit" value="add">
</form>
<br/><br/>
<?php $number = 0?>

<?php foreach ($carreras as $carrera):?>
    <a class="big" href="../carreras/view/<?php echo $carrera['Carrera']['id']?>/<?php echo strtolower(str_replace(" ","-",$carrera['Carrera']['nombre']))?>">
    <span class="item">
    <?php echo ++$number?>
    <?php echo $carrera['Carrera']['nombre']?>
    </span>
    </a><br/>
<?php endforeach?>
