export async function createOrder(amount:number){

const response = await fetch("/api/create-order",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({amount})
})

return response.json()

}