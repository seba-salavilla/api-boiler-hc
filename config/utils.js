let utils = {
    getIp : function (req, res, next) {
        var xForwardedFor = (req.headers['x-forwarded-for'] || '').replace(/:\d+$/, '');
        var ip = xForwardedFor || req.connection.remoteAddress;
        if (ip.includes('::ffff:')) {
            ip = ip.split(':').reverse()[0]
        }
        if ((ip === '127.0.0.1' || ip === '::1')) {
            return "Localhost" // {error:"This won't work on localhost"}
        }
        req.ipInfo = ip;
        next();
    },
    inGeo : function(lat, lng, polygon){
        var inPoly = false, vertex1, vertex2;
        var j = polygon.length - 1;
        for (var i = 0; i < polygon.length; i++) {
            vertex1 = [parseFloat(polygon[i][0]),parseFloat(polygon[i][1])];
            vertex2 = [parseFloat(polygon[j][0]),parseFloat(polygon[j][1])];
            if (
                vertex1[0] <  lng &&
                vertex2[0] >= lng ||
                vertex2[0] <  lng &&
                vertex1[0] >= lng
            ) {
                if (
                vertex1[1] +
                (lng - vertex1[0]) /
                (vertex2[0] - vertex1[0]) *
                (vertex2[1] - vertex1[1]) <
                lat
                ) {
                    inPoly = !inPoly;
                }
            }
    
            j = i;
        }
    
        return inPoly
    },
    rutFormat : function (rut) {
        //SET MAYUSCULA, QUITA ESPACIOS, FORMAT RUT XXXXXXXX-X
        return rut.toUpperCase().replace(/[^0-9K]/g, '').replace( /^(\d{1,2})(\d{3})(\d{3})(\w{1})$/, '$1$2$3-$4')
    },
    getDateToFiles : function () {
        let dt = new Date().toLocaleString('es-ES',{year:"numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second:'2-digit'})
        console.log(dt)
        dt = dt.replace(/[^\w\s]/gi, '_') //dt.replace(/[^a-zA-Z0-9]/g,'_');
        console.log(dt)
        return dt
    },
    msFormat : function(ms){
        var seconds = ms / 1000
        var days = Math.floor(seconds / (24 * 60 * 60))
        seconds = seconds % (24 * 60 * 60)
        var hours = Math.floor(seconds / (60 * 60))
        seconds = seconds % (60 * 60)
        var minutes = Math.floor(seconds / (60))
        seconds = Math.floor(seconds % (60))
        
        if(days>=1)return days+"d "+hours + "h " + minutes + "m"
        if(hours>0) return hours+"h "+minutes + "m " + seconds + "s"
        if(minutes>0) return minutes + "m " + seconds + "s"
        if(seconds>0) return seconds + "s"

        return "0s"
    },

    _getDistancia : function(lat1,lon1, lat2,lon2){
        rad = function(x) {return x*Math.PI/180;}
        var R = 6378.137; //Radio de la tierra en km 
        var dLat = rad( lat2 - lat1 );
        var dLong = rad( lon2 - lon1 );
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * 
        Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      
        var d = R * c; 
        return d ; 
    },

    _dateFormatString : function(dt, seconds){
        dt = new Date(dt)
        if(seconds){
            dt = dt.toLocaleDateString('es-ES', {/*timeZoneName: 'short',*/ year:"numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})
        }else{
            dt = dt.toLocaleDateString('es-ES', {/*timeZoneName: 'short',*/ year:"numeric", month: '2-digit', day: '2-digit'})
        }
        return dt
    }
}

module.exports = utils

//redis-cli --cluster create 200.27.222.77:7000 200.27.222.77:7001 200.27.222.77:7002 186.103.188.61:7003 186.103.188.61:7004 186.103.188.61:7005 --cluster-replicas 1
