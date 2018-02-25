---
title: 'Wellington Round the Bays 10k: 2018'
date: 2018-02-25 17:01:43
tags: [running, fitness]
use_excerpt: true
needs_charts: true
---

<blockquote class="embedly-card" data-card-controls="0" data-card-key="f1631a41cb254ca5b035dc5747a5bd75"><h4><a href="https://www.relive.cc/view/1412587449?r=embed-site">Relive 'Wellington - Kilbirnie'</a></h4></blockquote>
        <script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>

Walking to work a number of weeks ago; I happened to pass volunteers handing out pamphlets to commuters streaming out of Wellington Station. Normally, I'd avoid this like the plague — my headphones acting as an aural barrier so I can slide on by without interaction. However, noticing these people were giving out discount entries into one of Wellington's annual running events, and being on a fitness binge at the time, I decided to grab one and sign up. This was the [Wellington Round The Bays 10km](http://wellingtonroundthebays.co.nz).

<!-- more -->

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The Bluebridge 10km crowd is looking good! <a href="https://twitter.com/hashtag/CignaRTB?src=hash&amp;ref_src=twsrc%5Etfw">#CignaRTB</a> <a href="https://t.co/NIazKfocOC">pic.twitter.com/NIazKfocOC</a></p>&mdash; Cigna Round the Bays (@CignaRTB) <a href="https://twitter.com/CignaRTB/status/964942567488962560?ref_src=twsrc%5Etfw">February 17, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 


Fast-forward to last 18<sup>th</sup> February, and I'm lined up on Wellington's waterfront at 8AM, surrounded by thousands of other race entrants, with AirPods in and my finger hovering over my Apple Watch's screen ready to begin to a just under 50 minutes of running workout. My training up to this point had consisted of on-and-off weekday running during my work lunchbreak, often 4 to 8 kilometres per day. If I'd been more consistent in ensuring I did at least one run daily, my race day result would likely have been significantly better.

However, considering I've had a chesty cough for over a month now, I was surprised by my placing; and surpassed even my expected pace of 5 minutes per kilometre. I guess adrenaline does count for something! Race official statistics were:

* 47:49 for the full distance (pace: 4 minutes 46 seconds per kilometre)
* 188<sup>th</sup> out of 2944 completing participants (top 6.39%)
* 151<sup>st</sup> out of 1245 males (top 12.13%)
* 40<sup>th</sup> out of 346 in my bracket (M20-29) (top 11.56%)

5km and 10km split times were effectively the same.

The run itself was surprisingly easy — possibly the herd mentality of simply following the person in front of you manifesting itself. However, with less wind than I expected, and the bright morning sun, it was hard not to start overheating past the halfway point. 

Caloric & heart related data were the following:

* 525 calories (~53 per kilometre)
* 191bpm average heart rate (peak: 197bpm)

# Discrepancies

Interestingly; Apple Watch recorded a distance of 10.36km, a ~4% distance discrepancy, despite being sure to begin and end my workout as I was crossing the start and finish lines — when the timing chips began working. Once uploaded to Strava, I was bulked into everyone else's runs for the event (at time of writing; numbering 49 other entrants who had logged their 10k distance), so I decided to do some investigating to see if just my entry was anomalous.

<canvas id="myChart" width="400" height="300"></canvas>
<script>
var entries = [
    { "distance": 10.2, "device": "Garmin Forerunner 235" },
    { "distance": 10.17, "device": "Garmin Forerunner 235" },
    { "distance": 10.14, "device": "iPhone" },
    { "distance": 10.16, "device": "Garmin Forerunner 935" }, 
    { "distance": 10.12, "device": "TomTom" },
    { "distance": 10.24, "device": "iPhone" },
    { "distance": 10.29, "device": "iPhone" },
    { "distance": 10.22, "device": "Garmin Forerunner 920XT" },
    { "distance": 10.27, "device": "iPhone" },
    { "distance": 10.15, "device": "Garmin Fenix 3" },
    { "distance": 10.12, "device": "TomTom" },
    { "distance": 10.2, "device": "Fitbit Surge" },
    { "distance": 10.15, "device": "Garmin Forerunner 230" },
    { "distance": 10.26, "device": "iPhone" },
    { "distance": 10.27, "device": "Unknown" },
    { "distance": 10.19, "device": "iPhone" },
    { "distance": 10.22, "device": "Garmin Forerunner 910XT" },
    { "distance": 10.36, "device": "iPhone" },
    { "distance": 10.16, "device": "Farmin Forerunner 230" },
    { "distance": 10.15, "device": "Garmin Forerunner 15" },
    { "distance": 10.14, "device": "Garmin Forerunner 235" },
    { "distance": 10.17, "device": "Garmin Forerunner 220" },
    { "distance": 10.32, "device": "iPhone" },
    { "distance": 10.18, "device": "Garmin Forerunner 935" },
    { "distance": 10.13, "device": "Garmin Forerunner 220" },
    { "distance": 10.24, "device": "iPhone"  },
    { "distance": 10.18, "device": "Garmin Fenix 5S" },
    { "distance": 10.18, "device": "iPhone" },
    { "distance": 10.13, "device": "TomTom" },
    { "distance": 10.18, "device": "Garmin Forerunner 35" },
    { "distance": 10.11, "device": "Garmin Forerunner 735XT" },
    { "distance": 10.15, "device": "Garmin Forerunner 235" },
    { "distance": 10.27, "device": "Android" },
    { "distance": 10.15, "device": "Garmin Fenix 5S" },
    { "distance": 10.10, "device": "Android" },
    { "distance": 11.17, "device": "Fitbit Blaze" },
    { "distance": 10.11, "device": "TomTom" },
    { "distance": 10.05, "device": "Garmin Fenix 3" },
    { "distance": 10.42, "device": "Android" },
    { "distance": 10.19, "device": "Unknown" },
    { "distance": 10.3, "device": "iPhone" },
    { "distance": 10.38, "device": "iPhone" },
    { "distance": 10.23, "device": "Garmin Vivoactive HR" },
    { "distance": 10.13, "device": "Garmin Forerunner 235" },
    { "distance": 10.23, "device": "Garmin Forerunner 920XT" },
    { "distance": 10.16, "device": "Garmin Forerunner 235" },
    { "distance": 10.01, "device": "Garmin Forerunner 935" },
    { "distance": 10.08, "device": "Android" },
    { "distance": 10.36, "device": "Apple Watch" }
];

var buckets = [];

for (var i = 995; i <= 1045; i += 5) {
    buckets.push({ 
        min: i, 
        max: i + 4, 
        freq: 0,
        label: (i / 100).toFixed(2) + "–" + ((i + 4) / 100).toFixed(2) + "km" 
     });
}

for (var i = 0; i < entries.length; i++) {
    var currentBin = 0; 
    if (entries[i].distance > 10.45) {
        continue;
    }
    
    while ((entries[i].distance * 100) > buckets[currentBin].max) {
        currentBin++;
    }
    buckets[currentBin].freq++;
}

var filteredDistances = entries.map(e => e.distance).filter(d => d <= 10.45);
var mean = filteredDistances.reduce((a,v) => a+v) / filteredDistances.length; 

var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: buckets.map(b => b.label),
        datasets: [{
            label: 'Runners per bin (mean: ' + mean.toFixed(2) + ')',
            data: buckets.map(b => b.freq),
            backgroundColor: 'rgba(196, 145, 138, 0.8)'
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    max: 20,
                    beginAtZero:true
                }
            }]
        }
    }
});
</script>

Nope! Not just me. The mean distance, discarding one runner's data over 11km, was 10,194 metres on the course; approximately a ~2% discrepancy over the courses' total distance. Measurements came from the following devices: 

I hesitate to explain these dispersions presently; but I'm happy to chalk it up to GPS over-estimation and slightly overzealous route mapping than anything specifically wrong with the course's design. 

# Next steps

With my enthusiasm for running still intact; I'll likely attempt the [Round the Vines 10km](https://www.roundthevines.org.nz) in Martinborough come late-March. With a later starting time and my expectation for higher temperatures given the location; I don't expect another competitive PB. Looking beyond this, [Xterra Wellington](https://www.xterrawellington.co.nz) is on my radar too. 
