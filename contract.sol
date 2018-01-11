pragma solidity^0.4.13;
contract MedicalForm
{
bytes32[] formid;

struct Form {
string gen_data;
string past_his;
string present_his;
string others;
bytes32 id;
}

struct user{
    bytes32 name;
    bytes32 email;
    uint phn;
    bytes32 userId;
    string[4] a;
    
    
    mapping(bytes32=>bool) checkId;
}

mapping(bytes32 =>Form) FormMap;

mapping(bytes32 =>user) userMap;


function reg(bytes32 name, bytes32 email,uint phn){
    
    Form  memory FormMap1;
    bytes32 ran=keccak256(uint256(keccak256(now,msg.sender)));
    FormMap1.id = ran;
    userMap[ran].name = name;
    userMap[ran].email = email;
    userMap[ran].phn = phn;
    userMap[ran].userId = ran;
    formid.push(ran);
    userMap[ran].checkId[ran] = true;
    
}

function set(string MedicalInfo, bytes32 id, uint index)
{
    
        userMap[id].a[index] = MedicalInfo;
    

}


function getId()constant returns(bytes32[]){
return formid;
}

function getForm(bytes32 id,uint256 index)constant returns(string){
    
       
       return (userMap[id].a[index]);
    
       
}

}
