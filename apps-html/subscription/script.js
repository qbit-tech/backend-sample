let subscriptionForm = document.getElementById("subscriptionForm");

subscriptionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value;
    
    let checkedValues = []; 
    const inputElements = document.getElementsByClassName('subs-checkbox');
    for(var i=0; inputElements[i]; ++i){
      if(inputElements[i].checked){
            checkedValues.push(inputElements[i].value)
            // break;
      }
    }

    console.log(checkedValues)

    await axios.put(REPLACE_SUBSCRIPTION_URL,
        {
            email: email,
            types: checkedValues
        },
    );

    alert('Success update')
  });

const onLoad = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const res = await axios.get(REPLACE_GET_MY_SUBSCRIPTION_URL + email)

    const subscriptionData = res.data.payload


    const emailForm = document.getElementById("email");

    emailForm.value = email

    // console.log(getSubscription)
    for(const type of subscriptionData.subscriptionTypes) {
        document.getElementById(type.toLowerCase()).checked = true;
    }

}

window.onLoad = onLoad()
  