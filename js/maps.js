function initMap() {
    let latitude = 37.235
    let longitude = -115.811111
    let map_options = {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
        // mapTypeId: 'satellite',
        styles: uber_style
    }
    map = new google.maps.Map(document.getElementById("map"), map_options)
}
