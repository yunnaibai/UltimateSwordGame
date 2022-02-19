export default function authenticate() {
    if(localStorage.getItem("token") == null || localStorage.getItem("username") == null) return false
    return fetch(`${window.location.href.replace("/game", "")}authenticate/`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            username: localStorage.getItem("username"),
            access_token: localStorage.getItem("token")
        })
    }).then((res) => {
        if(res.ok){
            return true
        }
        return false
    }).catch(() => {
        console.log("Error fetch")
        return false
    })
}