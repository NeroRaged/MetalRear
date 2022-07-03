<?php
    
    header('content-type: application/json; charset=utf-8');

    $response = array();
    $con = mysqli_connect("localhost", "proyec71", "ClassicKevin", "proyec71_mi_metalrear");
    $response["success"] = false;
        
    try{

        $strSQL = "SELECT score,name FROM scores ORDER BY score DESC;";
         
        $result = mysqli_query($con, $strSQL);
        
        while($row = mysqli_fetch_assoc($result)){
            $test[] = $row;
        }

        $response["data"] = $test;  
        $response["success"] = true;  
        
    }catch(Exception $e){
        $response["error"] = $e->getMessage(); 
    }
    mysqli_close($con);
    
    echo json_encode($response);
    
?>


