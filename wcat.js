/*
The cat (short for “concatenate“) command is one of the most frequently used commands in Linux/Unix-like operating systems. 
cat command allows us to create single or multiple files, view content of a file, concatenate files and redirect output in 
terminal or files.

In this Program, we are going to make a clone tool similar to cat which we have named "wcat" and will develop few handy 
wcat commands.
*/

const fs=require("fs"); 
let arguments=process.argv.slice(2); //As 1st two argument were node ,filepath

//"-" before any command will Symbolise a flag 
//Assuing there are more than one flag and mulitple filenames occuring in a command
let flags=[];
let filenames=[];
let secondaryArguments=[];

//segregating flags, filenames, Special characters
for(let i of arguments){
    if(i[0]=="-"){ 
        flags.push(i);
    } else if(i[0]=="%"){  
        secondaryArguments.push(i.slice(1));
    } 
    else {
        filenames.push(i);
    }
}

//Commands present in our wcat tool
for(let file of filenames){ //traversing in multiple files 
    let filedata=fs.readFileSync(file,"utf-8"); //reading the content of files
    for(let flag of flags){ // traversing in flags
        if(flag=="-rs"){ // FLAG 1: removing spaces (rs) present in the file given.
            filedata= removeall(filedata," ");
        }
        if(flag=="-rn"){ // FLAG 2: removing newline (rn) present in the file given.
            filedata= removeall(filedata,"\r\n"); // mac users dont have to use \r
        }
        if(flag=="-rsw"){ //FLAG 3: removing  specific characters (rsw) followed by % ,present in the file given.
          for(let secondaryArgument of secondaryArguments){
              filedata=  removeall(filedata,secondaryArgument);
          }
        }
        if(flag=="-s"){ // FLAG 4: putting serialised (s) numbering in front of all the lines present in the file given.
            let data=addsequence(filedata);
            console.log(data);
            console.log("***Before Sequencing was Performed***");
        }
        if(flag=="-sn"){ // FLAG 5: putting serialised (sn) numbering in front of all the non-empty lines present in the file given.
            let data=addsequencetnel(filedata);
            console.log(data);
            console.log("***Before Sequencing was Performed***");
        }
        if(flag=="-rel"){ // FLAG 6: removing extra or redundant line (rel) present in the file given.
            let ans=removeextraline(filedata);
            console.log("***Before Removing Reducdant line***");
        }
        if(flag=="-dcf"){ // FLAG 7: displaying content inside multiple files (dcf).
            let ans=displaycontentfile(filedata);
        }
        if(flag=="-st"){ // FLAG 8: sorting (st) content(A->Z order) present inside the files given. 
           let ans=sortcontent(filedata);
           for(let i=0;i<ans.length;i++){
           console.log(ans[i]);
          }
          console.log("***Before Sorting was Performed***");
        }
        if(flag == "-af") { // FLAG 9: appending multiple files in a single file (af).
            filedata = fs.readFileSync(file, 'utf-8', function() {
                console.log(filedata);
            });
            fs.appendFileSync("appendedFile.txt", filedata);
        }
        if(flag == "-cf") { // FLAG 10: clearing file (cf) contents of the given file/files.
            fs.writeFileSync(file, ''); // it will overwrite the content without, actually writing over 
            console.log("***Cleared Content***");
        }
        if(flag == "-df") { // FLAG 11: deleting file (df) i.e passed through commands
            console.log("***File Deleted***");
            fs.unlinkSync(file);
        }
        if(flag == "-rsc") { // FLAG 12: removing special characters (rsc) except Alphabets,Digits and spaces. ,present in the file given.
            let tempString = "";
            for(let character of filedata) { 
                if((character.charCodeAt(0) >= 65 && character.charCodeAt(0) <= 90) || (character.charCodeAt(0) >= 97 && character.charCodeAt(0) <= 122) || character== " " || (character.charCodeAt(0) >=48  && character.charCodeAt(0) <=57 )) {  
                    tempString += character;
                }
            }
            filedata = tempString;
        }
        if(flag=="-rel1"){ // FLAG 13: removing all extra/empty lines except 1 (rel1) empty line after every non-empty line present in the file given.
            let ans=removeExtraLinesEceptOne(filedata);
            for(let i=0;i<ans.length;i++){
                console.log(ans[i]);
            }
            console.log("***Before Removing Reducdant line***");
        }
    }
    console.log(filedata);
}

// Removeall function will remove the data i.e passed into its arugments 
function removeall(string, removedata){
    return string.split(removedata).join("");
}

// Addsequence function will add sequence or line number to the content passed in its arguments 
function addsequence(content){
    let contentarr=content.split("\r\n");
    for(let i=0;i<contentarr.length;i++){
        contentarr[i]=(i+1)+" "+contentarr[i]; //"i+1": as we want to start numbering from 1 example: 1 Hello Mate
    }
    return contentarr;
}

// Addsequence till new line function will add line number to the line which consist of some content
function addsequencetnel(content){
    let contentarr=content.split("\r\n");
    let count=1;
    for(let i=0;i<contentarr.length;i++){
        if(contentarr[i]!=""){ //To check whether its a empty line or not
            contentarr[i]=count+" "+contentarr[i];
            count++;
        }
    }
    return contentarr;
}

// Remove extra line function will remove all the redundant lines  from our file
function removeextraline(filedata){
    let lines = filedata.split("\r\n");
    for(let i = 0; i < lines.length; i++) {
        if(lines[i] != "") { //case:- line not empty.
            console.log(lines[i]);
        }
    }
}

// Display Contents of File function shows content of all the file passed in command
function displaycontentfile(content){
    return content;
}

// Sorting function sorts contents of multiple files (A->Z or a->z)
function sortcontent(filedata){
    let contentarr=filedata.split("\r\n");
    let data=[];
    for(let i=1;i<contentarr.length;i++){
        if(contentarr[i]=="" && contentarr[i-1]==""){
            contentarr[i]=null;
        }
        if(contentarr[i]=="" && contentarr[i-1]==null){
            contentarr[i]=null;
        }
    }
    for(let i=0;i<contentarr.length;i++){
        if(contentarr[i]!=null){
            data.push(contentarr[i]);
        }
    }
    data.sort();
    return data;
}

// Remove extra line expect one after non empty line function will remove all the redundant lines  from our file  
function removeExtraLinesEceptOne(filedata) {
    let contentarr=filedata.split("\r\n");
    let data=[];
    for(let i=1;i<contentarr.length;i++){
        if(contentarr[i]=="" && contentarr[i-1]==""){
            contentarr[i]=null;
        }
        if(contentarr[i]=="" && contentarr[i-1]==null){
            contentarr[i]=null;
        }
    }
    for(let i=0;i<contentarr.length;i++){
        if(contentarr[i]!=null){
            data.push(contentarr[i]);
        }
    }
    return data;
}