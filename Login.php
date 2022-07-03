<?php
    $response = array();
    try{
        $con = mysqli_connect("localhost", "proyec71", "Aeshinero94", "proyec71_mi_metalrear");
    
        
        $name = $_POST["name"];
        $pass = $_POST["pass"];
        

        $strSQL = "SELECT  idUser, nameUser, passUser, musicUser, diffUser FROM users WHERE nameUser =".$name.;
 
        $response["success"] = false;  
        
        if($query = mysqli_query($con, $strSQL)){
            
            $result = mysqli_fetch_array($query);
            
            if ($result["passUser"]==$pass){
                //$user = $result["username"]."";
                $user = array();
                $user["id"] = $result["idUser"];
                $user["name"] = $result["nameUser"];
                $user["music"] = $result["musicUser"];
                $user["diff"] = $result["diffUser"];
                
                $response["data"] = $user;  
                $response["success"] = true; 
                break;
            }else{
                $response["error"] = "Usuario o contraseña incorrecta."; 
                break;
            }
        }else{
            $response["error"] = "Usuario no existe."; 
        }
    }catch(Exception $e){
        $response["error"] = $e->getMessage(); 
    }
    
    echo json_encode($response);
    
?>