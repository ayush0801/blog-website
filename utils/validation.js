const isEmailValid = (email)=>{
   const re = /\S+@\S+\.\S+/
   return re.test(email)
}

module.exports = {isEmailValid}