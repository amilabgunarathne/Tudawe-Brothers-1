<?php include 'db.php'; ?>
<?php
session_start();
$id=$_SESSION["id"];

$json = file_get_contents('php://input');

$obj = json_decode($json,true);

$job_level = $obj['job_level'];
$job_code = $obj['job_code'];
$text = $obj['text'];

$query = "SELECT * FROM AccountUsers WHERE UserID = '" . $id . "'";
$row_set = sqlsrv_query($conn, $query);
$row = sqlsrv_fetch_array($row_set, SQLSRV_FETCH_ASSOC);
$name = $row['UserName'];

$reject = $name." rejected ".$job_code;

// $details = array();
if($job_level == '1st Level'){
    $sql = "UPDATE SiteRequisitionMaster SET FLReject = 1, FLRejectRemarks = '" . $text . "' WHERE Job_Code = '" . $job_code . "'";
}elseif($job_level == '2nd Level'){
    $sql = "UPDATE SiteRequisitionMaster SET SLevelReject = 1, SLRejectRemarks = '" . $text . "' WHERE Job_Code = '" . $job_code . "'";
}elseif($job_level == '3rd Level'){
    $sql = "UPDATE SiteRequisitionMaster SET TLReject = 1, TLRejectRemarks = '" . $text . "' WHERE Job_Code = '" . $job_code . "'";
}
$result_set = sqlsrv_query($conn, $sql);
if($result_set){

    $insert = "INSERT INTO Actions(action, seen, job_code, member) VALUES('" . $reject . "', '0','" . $job_code . "','" . $id . "')";
    $insert_set = sqlsrv_query($conn, $insert);
    $msg = "Job Rejected";
    // $SuccessMsgJson = json_encode(array('results' => $details));
    $SuccessMsgJson = json_encode($msg);
    // Echo the message.
    echo $SuccessMsgJson;
}else{
    $msg = "Job reject failed";
    // $SuccessMsgJson = json_encode(array('results' => $details));
    $SuccessMsgJson = json_encode($msg);
    // Echo the message.
    echo $SuccessMsgJson;
}

?>