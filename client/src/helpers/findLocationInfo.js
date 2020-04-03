export default function findUsersCoordinates(setFunc) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setFunc)
    }
}