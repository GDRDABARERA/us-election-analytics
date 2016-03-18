
    // Document on load.
    $(function() {


        var top5Worker = new Worker('js/workerCandidate.js');
        top5Worker.onmessage = function(event) {
            //console.log("Completed top5 " + event.data + "iterations");
            var top=event.data;
           // console.log(JSON.stringify(top));

            for(var i=0;i<top.length;i++){
                $(top[i].imageID).attr("src", top[i].ImgUrl);
                $(top[i].nameID).html(top[i].fullName);
                $(top[i].countID).html(top[i].retweet);


            }
            var R= (top[0].retweet)+(top[2].retweet);
            var D= (top[1].retweet)+(top[3].retweet);
            var R1= (top[0].retweet)/R *100;var R2=(top[2].retweet)/R * 100;
            var D1= (top[1].retweet)/D *100;var D2=(top[3].retweet)/D * 100;
            $(top[0].countID).html(R1+"%");  $(top[2].countID).html(R2+"%");
            $(top[1].countID).html(D1+"%");  $(top[3].countID).html(D2+"%");



             top5Worker.terminate();
        };

         drawCommunityGraph("graph");
         ajaxLatest;
         ajaxPopular("Trump");
         PopularElection("Trump");
         ajaxPopularLink;
         ajaxNews();
         setInterval(ajaxLatest, 5000);
         ajaxGarphSentiment("js/SentimetGraphServer.jag","11","22","33");



      //  setInterval('ajaxPopular("Trump");', 100000);

       // setInterval('PopularElection("Trump");',100000);

       // setInterval(ajaxPopularLink, 8000);





    });

