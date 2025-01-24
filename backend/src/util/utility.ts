export function socketDataParser(data:any):{type:string,data?:string} {
    const ipString = data.toString();
    const dataObj = JSON.parse(ipString);
    return dataObj;
}


export function socketReturnParser(type:string,message:string,data?:any) : string {
    return JSON.stringify({type:type,message:message,data:data});
}

export function logOutPut(userData:Map<string,string[]>,roomData:Map<string,string[]>):void {
    console.group("User Data");
    console.table(Array.from(userData.entries()), ["0", "1"]);
    console.groupEnd();

    console.group("Room Data");
    console.table(Array.from(roomData.entries()), ["0", "1"]);
    console.groupEnd();
    console.log("\n <---------------Message end ----------------->");
}