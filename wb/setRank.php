<?php
    
    header('content-type: application/json; charset=utf-8');

    $response = array();
    $con = mysqli_connect("localhost", "proyec71", "ClassicKevin", "proyec71_mi_metalrear");
    $response["success"] = false;
        
    try{
        $user = $_POST['user'];
        $score = $_POST['score'];
        
        if ($user==""){
            $user="SNK";
        }
        
        $statement = mysqli_prepare($con, "INSERT INTO scores(name, score) VALUES (?,?)");
        
        if ( !$statement ) {
            die('mysqli error: '.mysqli_error($con));
        }
        
        mysqli_stmt_bind_param($statement, "si", $user, $score);
        
        mysqli_stmt_execute($statement);
        $response["success"] = true;  
        
    }catch(Exception $e){
        $response["error"] = $e->getMessage(); 
    }
    mysqli_close($con);
    
    echo json_encode($response);
    
?>