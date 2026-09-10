/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 62.0, "minX": 0.0, "maxY": 2268.0, "series": [{"data": [[0.0, 62.0], [0.1, 65.0], [0.2, 66.0], [0.3, 67.0], [0.4, 67.0], [0.5, 67.0], [0.6, 68.0], [0.7, 68.0], [0.8, 68.0], [0.9, 68.0], [1.0, 69.0], [1.1, 69.0], [1.2, 69.0], [1.3, 69.0], [1.4, 69.0], [1.5, 70.0], [1.6, 70.0], [1.7, 70.0], [1.8, 70.0], [1.9, 70.0], [2.0, 70.0], [2.1, 70.0], [2.2, 71.0], [2.3, 71.0], [2.4, 71.0], [2.5, 71.0], [2.6, 71.0], [2.7, 71.0], [2.8, 71.0], [2.9, 71.0], [3.0, 72.0], [3.1, 72.0], [3.2, 72.0], [3.3, 72.0], [3.4, 72.0], [3.5, 72.0], [3.6, 72.0], [3.7, 72.0], [3.8, 72.0], [3.9, 72.0], [4.0, 72.0], [4.1, 73.0], [4.2, 73.0], [4.3, 73.0], [4.4, 73.0], [4.5, 73.0], [4.6, 73.0], [4.7, 73.0], [4.8, 73.0], [4.9, 73.0], [5.0, 73.0], [5.1, 74.0], [5.2, 74.0], [5.3, 74.0], [5.4, 74.0], [5.5, 74.0], [5.6, 74.0], [5.7, 74.0], [5.8, 74.0], [5.9, 74.0], [6.0, 74.0], [6.1, 74.0], [6.2, 75.0], [6.3, 75.0], [6.4, 75.0], [6.5, 75.0], [6.6, 75.0], [6.7, 75.0], [6.8, 75.0], [6.9, 75.0], [7.0, 75.0], [7.1, 75.0], [7.2, 75.0], [7.3, 76.0], [7.4, 76.0], [7.5, 76.0], [7.6, 76.0], [7.7, 76.0], [7.8, 76.0], [7.9, 76.0], [8.0, 76.0], [8.1, 76.0], [8.2, 76.0], [8.3, 76.0], [8.4, 76.0], [8.5, 77.0], [8.6, 77.0], [8.7, 77.0], [8.8, 77.0], [8.9, 77.0], [9.0, 77.0], [9.1, 77.0], [9.2, 77.0], [9.3, 77.0], [9.4, 77.0], [9.5, 77.0], [9.6, 77.0], [9.7, 78.0], [9.8, 78.0], [9.9, 78.0], [10.0, 78.0], [10.1, 78.0], [10.2, 78.0], [10.3, 78.0], [10.4, 78.0], [10.5, 78.0], [10.6, 78.0], [10.7, 78.0], [10.8, 78.0], [10.9, 79.0], [11.0, 79.0], [11.1, 79.0], [11.2, 79.0], [11.3, 79.0], [11.4, 79.0], [11.5, 79.0], [11.6, 79.0], [11.7, 79.0], [11.8, 79.0], [11.9, 79.0], [12.0, 79.0], [12.1, 80.0], [12.2, 80.0], [12.3, 80.0], [12.4, 80.0], [12.5, 80.0], [12.6, 80.0], [12.7, 80.0], [12.8, 80.0], [12.9, 80.0], [13.0, 80.0], [13.1, 80.0], [13.2, 80.0], [13.3, 81.0], [13.4, 81.0], [13.5, 81.0], [13.6, 81.0], [13.7, 81.0], [13.8, 81.0], [13.9, 81.0], [14.0, 81.0], [14.1, 81.0], [14.2, 81.0], [14.3, 81.0], [14.4, 82.0], [14.5, 82.0], [14.6, 82.0], [14.7, 82.0], [14.8, 82.0], [14.9, 82.0], [15.0, 82.0], [15.1, 82.0], [15.2, 82.0], [15.3, 82.0], [15.4, 82.0], [15.5, 82.0], [15.6, 83.0], [15.7, 83.0], [15.8, 83.0], [15.9, 83.0], [16.0, 83.0], [16.1, 83.0], [16.2, 83.0], [16.3, 83.0], [16.4, 83.0], [16.5, 83.0], [16.6, 84.0], [16.7, 84.0], [16.8, 84.0], [16.9, 84.0], [17.0, 84.0], [17.1, 84.0], [17.2, 84.0], [17.3, 84.0], [17.4, 84.0], [17.5, 84.0], [17.6, 85.0], [17.7, 85.0], [17.8, 85.0], [17.9, 85.0], [18.0, 85.0], [18.1, 85.0], [18.2, 85.0], [18.3, 85.0], [18.4, 85.0], [18.5, 86.0], [18.6, 86.0], [18.7, 86.0], [18.8, 86.0], [18.9, 86.0], [19.0, 86.0], [19.1, 86.0], [19.2, 86.0], [19.3, 86.0], [19.4, 87.0], [19.5, 87.0], [19.6, 87.0], [19.7, 87.0], [19.8, 87.0], [19.9, 87.0], [20.0, 87.0], [20.1, 87.0], [20.2, 88.0], [20.3, 88.0], [20.4, 88.0], [20.5, 88.0], [20.6, 88.0], [20.7, 88.0], [20.8, 88.0], [20.9, 88.0], [21.0, 88.0], [21.1, 89.0], [21.2, 89.0], [21.3, 89.0], [21.4, 89.0], [21.5, 89.0], [21.6, 89.0], [21.7, 89.0], [21.8, 89.0], [21.9, 90.0], [22.0, 90.0], [22.1, 90.0], [22.2, 90.0], [22.3, 90.0], [22.4, 90.0], [22.5, 90.0], [22.6, 90.0], [22.7, 90.0], [22.8, 91.0], [22.9, 91.0], [23.0, 91.0], [23.1, 91.0], [23.2, 91.0], [23.3, 91.0], [23.4, 91.0], [23.5, 91.0], [23.6, 91.0], [23.7, 92.0], [23.8, 92.0], [23.9, 92.0], [24.0, 92.0], [24.1, 92.0], [24.2, 92.0], [24.3, 92.0], [24.4, 92.0], [24.5, 92.0], [24.6, 93.0], [24.7, 93.0], [24.8, 93.0], [24.9, 93.0], [25.0, 93.0], [25.1, 93.0], [25.2, 93.0], [25.3, 93.0], [25.4, 93.0], [25.5, 93.0], [25.6, 94.0], [25.7, 94.0], [25.8, 94.0], [25.9, 94.0], [26.0, 94.0], [26.1, 94.0], [26.2, 94.0], [26.3, 94.0], [26.4, 95.0], [26.5, 95.0], [26.6, 95.0], [26.7, 95.0], [26.8, 95.0], [26.9, 95.0], [27.0, 95.0], [27.1, 95.0], [27.2, 95.0], [27.3, 95.0], [27.4, 95.0], [27.5, 96.0], [27.6, 96.0], [27.7, 96.0], [27.8, 96.0], [27.9, 96.0], [28.0, 96.0], [28.1, 96.0], [28.2, 96.0], [28.3, 96.0], [28.4, 96.0], [28.5, 97.0], [28.6, 97.0], [28.7, 97.0], [28.8, 97.0], [28.9, 97.0], [29.0, 97.0], [29.1, 97.0], [29.2, 97.0], [29.3, 97.0], [29.4, 97.0], [29.5, 97.0], [29.6, 98.0], [29.7, 98.0], [29.8, 98.0], [29.9, 98.0], [30.0, 98.0], [30.1, 98.0], [30.2, 98.0], [30.3, 98.0], [30.4, 98.0], [30.5, 98.0], [30.6, 98.0], [30.7, 98.0], [30.8, 99.0], [30.9, 99.0], [31.0, 99.0], [31.1, 99.0], [31.2, 99.0], [31.3, 99.0], [31.4, 99.0], [31.5, 99.0], [31.6, 99.0], [31.7, 99.0], [31.8, 99.0], [31.9, 100.0], [32.0, 100.0], [32.1, 100.0], [32.2, 100.0], [32.3, 100.0], [32.4, 100.0], [32.5, 100.0], [32.6, 100.0], [32.7, 100.0], [32.8, 100.0], [32.9, 100.0], [33.0, 100.0], [33.1, 101.0], [33.2, 101.0], [33.3, 101.0], [33.4, 101.0], [33.5, 101.0], [33.6, 101.0], [33.7, 101.0], [33.8, 101.0], [33.9, 101.0], [34.0, 101.0], [34.1, 102.0], [34.2, 102.0], [34.3, 102.0], [34.4, 102.0], [34.5, 102.0], [34.6, 102.0], [34.7, 102.0], [34.8, 102.0], [34.9, 102.0], [35.0, 102.0], [35.1, 102.0], [35.2, 102.0], [35.3, 103.0], [35.4, 103.0], [35.5, 103.0], [35.6, 103.0], [35.7, 103.0], [35.8, 103.0], [35.9, 103.0], [36.0, 103.0], [36.1, 103.0], [36.2, 103.0], [36.3, 103.0], [36.4, 103.0], [36.5, 104.0], [36.6, 104.0], [36.7, 104.0], [36.8, 104.0], [36.9, 104.0], [37.0, 104.0], [37.1, 104.0], [37.2, 104.0], [37.3, 104.0], [37.4, 104.0], [37.5, 104.0], [37.6, 104.0], [37.7, 104.0], [37.8, 105.0], [37.9, 105.0], [38.0, 105.0], [38.1, 105.0], [38.2, 105.0], [38.3, 105.0], [38.4, 105.0], [38.5, 105.0], [38.6, 105.0], [38.7, 105.0], [38.8, 105.0], [38.9, 105.0], [39.0, 106.0], [39.1, 106.0], [39.2, 106.0], [39.3, 106.0], [39.4, 106.0], [39.5, 106.0], [39.6, 106.0], [39.7, 106.0], [39.8, 106.0], [39.9, 106.0], [40.0, 106.0], [40.1, 107.0], [40.2, 107.0], [40.3, 107.0], [40.4, 107.0], [40.5, 107.0], [40.6, 107.0], [40.7, 107.0], [40.8, 107.0], [40.9, 107.0], [41.0, 107.0], [41.1, 107.0], [41.2, 107.0], [41.3, 108.0], [41.4, 108.0], [41.5, 108.0], [41.6, 108.0], [41.7, 108.0], [41.8, 108.0], [41.9, 108.0], [42.0, 108.0], [42.1, 108.0], [42.2, 108.0], [42.3, 108.0], [42.4, 108.0], [42.5, 108.0], [42.6, 109.0], [42.7, 109.0], [42.8, 109.0], [42.9, 109.0], [43.0, 109.0], [43.1, 109.0], [43.2, 109.0], [43.3, 109.0], [43.4, 109.0], [43.5, 109.0], [43.6, 109.0], [43.7, 109.0], [43.8, 110.0], [43.9, 110.0], [44.0, 110.0], [44.1, 110.0], [44.2, 110.0], [44.3, 110.0], [44.4, 110.0], [44.5, 110.0], [44.6, 110.0], [44.7, 110.0], [44.8, 110.0], [44.9, 110.0], [45.0, 110.0], [45.1, 111.0], [45.2, 111.0], [45.3, 111.0], [45.4, 111.0], [45.5, 111.0], [45.6, 111.0], [45.7, 111.0], [45.8, 111.0], [45.9, 111.0], [46.0, 111.0], [46.1, 111.0], [46.2, 111.0], [46.3, 112.0], [46.4, 112.0], [46.5, 112.0], [46.6, 112.0], [46.7, 112.0], [46.8, 112.0], [46.9, 112.0], [47.0, 112.0], [47.1, 112.0], [47.2, 112.0], [47.3, 112.0], [47.4, 112.0], [47.5, 113.0], [47.6, 113.0], [47.7, 113.0], [47.8, 113.0], [47.9, 113.0], [48.0, 113.0], [48.1, 113.0], [48.2, 113.0], [48.3, 113.0], [48.4, 113.0], [48.5, 113.0], [48.6, 114.0], [48.7, 114.0], [48.8, 114.0], [48.9, 114.0], [49.0, 114.0], [49.1, 114.0], [49.2, 114.0], [49.3, 114.0], [49.4, 114.0], [49.5, 114.0], [49.6, 114.0], [49.7, 115.0], [49.8, 115.0], [49.9, 115.0], [50.0, 115.0], [50.1, 115.0], [50.2, 115.0], [50.3, 115.0], [50.4, 115.0], [50.5, 115.0], [50.6, 115.0], [50.7, 116.0], [50.8, 116.0], [50.9, 116.0], [51.0, 116.0], [51.1, 116.0], [51.2, 116.0], [51.3, 116.0], [51.4, 116.0], [51.5, 116.0], [51.6, 116.0], [51.7, 116.0], [51.8, 117.0], [51.9, 117.0], [52.0, 117.0], [52.1, 117.0], [52.2, 117.0], [52.3, 117.0], [52.4, 117.0], [52.5, 117.0], [52.6, 117.0], [52.7, 117.0], [52.8, 118.0], [52.9, 118.0], [53.0, 118.0], [53.1, 118.0], [53.2, 118.0], [53.3, 118.0], [53.4, 118.0], [53.5, 118.0], [53.6, 118.0], [53.7, 118.0], [53.8, 118.0], [53.9, 119.0], [54.0, 119.0], [54.1, 119.0], [54.2, 119.0], [54.3, 119.0], [54.4, 119.0], [54.5, 119.0], [54.6, 119.0], [54.7, 119.0], [54.8, 120.0], [54.9, 120.0], [55.0, 120.0], [55.1, 120.0], [55.2, 120.0], [55.3, 120.0], [55.4, 120.0], [55.5, 120.0], [55.6, 120.0], [55.7, 120.0], [55.8, 121.0], [55.9, 121.0], [56.0, 121.0], [56.1, 121.0], [56.2, 121.0], [56.3, 121.0], [56.4, 121.0], [56.5, 121.0], [56.6, 121.0], [56.7, 122.0], [56.8, 122.0], [56.9, 122.0], [57.0, 122.0], [57.1, 122.0], [57.2, 122.0], [57.3, 122.0], [57.4, 122.0], [57.5, 122.0], [57.6, 123.0], [57.7, 123.0], [57.8, 123.0], [57.9, 123.0], [58.0, 123.0], [58.1, 123.0], [58.2, 123.0], [58.3, 123.0], [58.4, 124.0], [58.5, 124.0], [58.6, 124.0], [58.7, 124.0], [58.8, 124.0], [58.9, 124.0], [59.0, 124.0], [59.1, 124.0], [59.2, 124.0], [59.3, 124.0], [59.4, 125.0], [59.5, 125.0], [59.6, 125.0], [59.7, 125.0], [59.8, 125.0], [59.9, 125.0], [60.0, 125.0], [60.1, 126.0], [60.2, 126.0], [60.3, 126.0], [60.4, 126.0], [60.5, 126.0], [60.6, 126.0], [60.7, 126.0], [60.8, 127.0], [60.9, 127.0], [61.0, 127.0], [61.1, 127.0], [61.2, 127.0], [61.3, 127.0], [61.4, 127.0], [61.5, 127.0], [61.6, 128.0], [61.7, 128.0], [61.8, 128.0], [61.9, 128.0], [62.0, 128.0], [62.1, 128.0], [62.2, 128.0], [62.3, 128.0], [62.4, 129.0], [62.5, 129.0], [62.6, 129.0], [62.7, 129.0], [62.8, 129.0], [62.9, 129.0], [63.0, 129.0], [63.1, 130.0], [63.2, 130.0], [63.3, 130.0], [63.4, 130.0], [63.5, 130.0], [63.6, 130.0], [63.7, 130.0], [63.8, 131.0], [63.9, 131.0], [64.0, 131.0], [64.1, 131.0], [64.2, 131.0], [64.3, 131.0], [64.4, 131.0], [64.5, 131.0], [64.6, 131.0], [64.7, 132.0], [64.8, 132.0], [64.9, 132.0], [65.0, 132.0], [65.1, 132.0], [65.2, 132.0], [65.3, 132.0], [65.4, 132.0], [65.5, 133.0], [65.6, 133.0], [65.7, 133.0], [65.8, 133.0], [65.9, 133.0], [66.0, 133.0], [66.1, 133.0], [66.2, 134.0], [66.3, 134.0], [66.4, 134.0], [66.5, 134.0], [66.6, 134.0], [66.7, 134.0], [66.8, 135.0], [66.9, 135.0], [67.0, 135.0], [67.1, 135.0], [67.2, 135.0], [67.3, 135.0], [67.4, 135.0], [67.5, 135.0], [67.6, 136.0], [67.7, 136.0], [67.8, 136.0], [67.9, 136.0], [68.0, 136.0], [68.1, 136.0], [68.2, 136.0], [68.3, 137.0], [68.4, 137.0], [68.5, 137.0], [68.6, 137.0], [68.7, 137.0], [68.8, 137.0], [68.9, 138.0], [69.0, 138.0], [69.1, 138.0], [69.2, 138.0], [69.3, 138.0], [69.4, 138.0], [69.5, 139.0], [69.6, 139.0], [69.7, 139.0], [69.8, 139.0], [69.9, 139.0], [70.0, 139.0], [70.1, 139.0], [70.2, 140.0], [70.3, 140.0], [70.4, 140.0], [70.5, 140.0], [70.6, 140.0], [70.7, 140.0], [70.8, 140.0], [70.9, 141.0], [71.0, 141.0], [71.1, 141.0], [71.2, 141.0], [71.3, 141.0], [71.4, 142.0], [71.5, 142.0], [71.6, 142.0], [71.7, 142.0], [71.8, 142.0], [71.9, 142.0], [72.0, 143.0], [72.1, 143.0], [72.2, 143.0], [72.3, 143.0], [72.4, 143.0], [72.5, 143.0], [72.6, 143.0], [72.7, 144.0], [72.8, 144.0], [72.9, 144.0], [73.0, 144.0], [73.1, 144.0], [73.2, 145.0], [73.3, 145.0], [73.4, 145.0], [73.5, 145.0], [73.6, 145.0], [73.7, 145.0], [73.8, 145.0], [73.9, 146.0], [74.0, 146.0], [74.1, 146.0], [74.2, 146.0], [74.3, 146.0], [74.4, 147.0], [74.5, 147.0], [74.6, 147.0], [74.7, 147.0], [74.8, 147.0], [74.9, 148.0], [75.0, 148.0], [75.1, 148.0], [75.2, 148.0], [75.3, 148.0], [75.4, 149.0], [75.5, 149.0], [75.6, 149.0], [75.7, 149.0], [75.8, 149.0], [75.9, 150.0], [76.0, 150.0], [76.1, 150.0], [76.2, 150.0], [76.3, 150.0], [76.4, 150.0], [76.5, 151.0], [76.6, 151.0], [76.7, 151.0], [76.8, 151.0], [76.9, 152.0], [77.0, 152.0], [77.1, 152.0], [77.2, 152.0], [77.3, 152.0], [77.4, 152.0], [77.5, 153.0], [77.6, 153.0], [77.7, 153.0], [77.8, 153.0], [77.9, 154.0], [78.0, 154.0], [78.1, 154.0], [78.2, 154.0], [78.3, 155.0], [78.4, 155.0], [78.5, 155.0], [78.6, 155.0], [78.7, 155.0], [78.8, 156.0], [78.9, 156.0], [79.0, 156.0], [79.1, 156.0], [79.2, 156.0], [79.3, 157.0], [79.4, 157.0], [79.5, 157.0], [79.6, 158.0], [79.7, 158.0], [79.8, 158.0], [79.9, 159.0], [80.0, 159.0], [80.1, 159.0], [80.2, 160.0], [80.3, 160.0], [80.4, 160.0], [80.5, 160.0], [80.6, 161.0], [80.7, 161.0], [80.8, 161.0], [80.9, 161.0], [81.0, 162.0], [81.1, 162.0], [81.2, 162.0], [81.3, 163.0], [81.4, 163.0], [81.5, 163.0], [81.6, 163.0], [81.7, 163.0], [81.8, 164.0], [81.9, 164.0], [82.0, 164.0], [82.1, 165.0], [82.2, 165.0], [82.3, 165.0], [82.4, 166.0], [82.5, 166.0], [82.6, 166.0], [82.7, 167.0], [82.8, 167.0], [82.9, 167.0], [83.0, 168.0], [83.1, 168.0], [83.2, 168.0], [83.3, 169.0], [83.4, 169.0], [83.5, 169.0], [83.6, 169.0], [83.7, 170.0], [83.8, 170.0], [83.9, 170.0], [84.0, 171.0], [84.1, 171.0], [84.2, 171.0], [84.3, 172.0], [84.4, 172.0], [84.5, 172.0], [84.6, 173.0], [84.7, 173.0], [84.8, 173.0], [84.9, 174.0], [85.0, 174.0], [85.1, 175.0], [85.2, 175.0], [85.3, 175.0], [85.4, 175.0], [85.5, 176.0], [85.6, 176.0], [85.7, 177.0], [85.8, 177.0], [85.9, 178.0], [86.0, 178.0], [86.1, 178.0], [86.2, 179.0], [86.3, 179.0], [86.4, 180.0], [86.5, 180.0], [86.6, 181.0], [86.7, 181.0], [86.8, 181.0], [86.9, 181.0], [87.0, 182.0], [87.1, 182.0], [87.2, 182.0], [87.3, 183.0], [87.4, 183.0], [87.5, 184.0], [87.6, 184.0], [87.7, 185.0], [87.8, 186.0], [87.9, 186.0], [88.0, 186.0], [88.1, 187.0], [88.2, 187.0], [88.3, 188.0], [88.4, 188.0], [88.5, 189.0], [88.6, 189.0], [88.7, 190.0], [88.8, 190.0], [88.9, 191.0], [89.0, 191.0], [89.1, 192.0], [89.2, 192.0], [89.3, 193.0], [89.4, 194.0], [89.5, 194.0], [89.6, 195.0], [89.7, 195.0], [89.8, 196.0], [89.9, 197.0], [90.0, 197.0], [90.1, 198.0], [90.2, 198.0], [90.3, 199.0], [90.4, 199.0], [90.5, 200.0], [90.6, 200.0], [90.7, 201.0], [90.8, 202.0], [90.9, 202.0], [91.0, 203.0], [91.1, 204.0], [91.2, 205.0], [91.3, 205.0], [91.4, 206.0], [91.5, 207.0], [91.6, 207.0], [91.7, 208.0], [91.8, 209.0], [91.9, 210.0], [92.0, 210.0], [92.1, 211.0], [92.2, 212.0], [92.3, 213.0], [92.4, 214.0], [92.5, 215.0], [92.6, 215.0], [92.7, 216.0], [92.8, 217.0], [92.9, 218.0], [93.0, 219.0], [93.1, 220.0], [93.2, 221.0], [93.3, 222.0], [93.4, 223.0], [93.5, 225.0], [93.6, 226.0], [93.7, 228.0], [93.8, 229.0], [93.9, 231.0], [94.0, 232.0], [94.1, 233.0], [94.2, 235.0], [94.3, 236.0], [94.4, 237.0], [94.5, 239.0], [94.6, 240.0], [94.7, 242.0], [94.8, 244.0], [94.9, 246.0], [95.0, 247.0], [95.1, 250.0], [95.2, 251.0], [95.3, 253.0], [95.4, 254.0], [95.5, 256.0], [95.6, 258.0], [95.7, 261.0], [95.8, 262.0], [95.9, 265.0], [96.0, 267.0], [96.1, 269.0], [96.2, 271.0], [96.3, 274.0], [96.4, 278.0], [96.5, 281.0], [96.6, 284.0], [96.7, 287.0], [96.8, 290.0], [96.9, 294.0], [97.0, 299.0], [97.1, 303.0], [97.2, 307.0], [97.3, 313.0], [97.4, 317.0], [97.5, 321.0], [97.6, 325.0], [97.7, 330.0], [97.8, 334.0], [97.9, 340.0], [98.0, 346.0], [98.1, 352.0], [98.2, 358.0], [98.3, 367.0], [98.4, 374.0], [98.5, 383.0], [98.6, 397.0], [98.7, 409.0], [98.8, 423.0], [98.9, 444.0], [99.0, 463.0], [99.1, 478.0], [99.2, 501.0], [99.3, 541.0], [99.4, 576.0], [99.5, 660.0], [99.6, 733.0], [99.7, 815.0], [99.8, 928.0], [99.9, 1225.0], [100.0, 2268.0]], "isOverall": false, "label": "GET stress_test.jsp", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 10422.0, "series": [{"data": [[0.0, 5672.0], [2100.0, 2.0], [2200.0, 1.0], [600.0, 23.0], [700.0, 19.0], [200.0, 1174.0], [800.0, 17.0], [900.0, 16.0], [1000.0, 4.0], [1100.0, 4.0], [300.0, 284.0], [1200.0, 2.0], [1300.0, 3.0], [1400.0, 3.0], [400.0, 100.0], [100.0, 10422.0], [1600.0, 3.0], [1800.0, 2.0], [500.0, 45.0], [2000.0, 2.0]], "isOverall": false, "label": "GET stress_test.jsp", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 2200.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 10.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 17653.0, "series": [{"data": [[0.0, 17653.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 135.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 10.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 17.814323607427063, "minX": 1.78902246E12, "maxY": 100.0, "series": [{"data": [[1.78902264E12, 100.0], [1.7890227E12, 100.0], [1.78902252E12, 74.79907179907177], [1.78902258E12, 100.0], [1.78902246E12, 17.814323607427063], [1.78902276E12, 97.99573312645467]], "isOverall": false, "label": "Stress Thread Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78902276E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 105.27777777777777, "minX": 1.0, "maxY": 965.6666666666665, "series": [{"data": [[2.0, 179.0], [3.0, 404.8333333333333], [4.0, 520.75], [5.0, 224.99999999999994], [6.0, 214.47619047619048], [7.0, 190.8181818181818], [8.0, 156.41379310344828], [9.0, 168.3], [10.0, 174.29032258064518], [11.0, 197.80000000000004], [12.0, 158.25], [13.0, 171.93939393939397], [14.0, 174.16666666666666], [15.0, 149.2777777777778], [16.0, 150.50000000000003], [17.0, 147.14285714285714], [18.0, 143.75], [19.0, 965.6666666666665], [20.0, 295.35416666666674], [21.0, 149.71428571428572], [22.0, 153.5], [23.0, 160.89743589743594], [24.0, 181.49999999999997], [25.0, 143.8918918918919], [26.0, 136.05128205128207], [27.0, 142.74999999999997], [28.0, 169.37500000000006], [29.0, 148.7777777777778], [30.0, 144.68421052631584], [31.0, 136.10526315789468], [32.0, 142.49999999999997], [33.0, 161.4878048780487], [34.0, 136.4358974358974], [35.0, 131.6944444444444], [36.0, 129.63157894736838], [37.0, 126.24324324324326], [38.0, 137.1538461538461], [39.0, 143.17948717948724], [40.0, 141.38888888888886], [41.0, 111.2439024390244], [42.0, 147.75], [43.0, 137.3], [44.0, 147.525], [45.0, 119.70967741935485], [46.0, 131.51219512195115], [47.0, 133.82857142857137], [48.0, 173.67647058823528], [49.0, 272.108108108108], [50.0, 187.27906976744185], [51.0, 162.41025641025644], [52.0, 133.6829268292683], [53.0, 117.3030303030303], [54.0, 143.53846153846155], [55.0, 133.23076923076925], [56.0, 135.32352941176475], [57.0, 144.6578947368421], [58.0, 183.65853658536582], [59.0, 140.60526315789474], [60.0, 143.02631578947373], [61.0, 122.62857142857143], [62.0, 123.10526315789474], [63.0, 183.47500000000002], [64.0, 124.45238095238099], [65.0, 125.27777777777779], [66.0, 125.65789473684211], [67.0, 105.27777777777777], [68.0, 129.37142857142854], [69.0, 144.00000000000003], [70.0, 134.99999999999997], [71.0, 133.41025641025644], [72.0, 137.11764705882354], [73.0, 153.84090909090912], [74.0, 135.57575757575756], [75.0, 143.27500000000003], [76.0, 117.86842105263159], [77.0, 189.05555555555557], [78.0, 136.97560975609753], [79.0, 125.02380952380953], [80.0, 113.94736842105262], [81.0, 143.29268292682923], [82.0, 121.94736842105266], [83.0, 114.91891891891889], [84.0, 126.91666666666667], [85.0, 178.02857142857144], [86.0, 112.67441860465115], [87.0, 120.72972972972974], [88.0, 121.90243902439023], [89.0, 121.26315789473685], [90.0, 134.70000000000002], [91.0, 168.7317073170732], [92.0, 132.82500000000002], [93.0, 129.88372093023253], [94.0, 116.45714285714286], [95.0, 142.25714285714284], [96.0, 131.9761904761905], [97.0, 127.73684210526316], [98.0, 122.82051282051283], [99.0, 132.90909090909088], [100.0, 130.59661229610998], [1.0, 357.5]], "isOverall": false, "label": "GET stress_test.jsp", "isController": false}, {"data": [[91.04135296100672, 134.68243622878992]], "isOverall": false, "label": "GET stress_test.jsp-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 7062.466666666666, "minX": 1.78902246E12, "maxY": 372855.18333333335, "series": [{"data": [[1.78902264E12, 366544.3], [1.7890227E12, 366442.5333333333], [1.78902252E12, 372855.18333333335], [1.78902258E12, 366646.1], [1.78902246E12, 76749.33333333333], [1.78902276E12, 262413.4666666667]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.78902264E12, 33729.36666666667], [1.7890227E12, 33720.0], [1.78902252E12, 34310.1], [1.78902258E12, 33738.73333333333], [1.78902246E12, 7062.466666666666], [1.78902276E12, 24147.266666666666]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78902276E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 124.46972222222206, "minX": 1.78902246E12, "maxY": 196.5026525198939, "series": [{"data": [[1.78902264E12, 131.22049430713636], [1.7890227E12, 124.46972222222206], [1.78902252E12, 139.10892710892728], [1.78902258E12, 133.28983897834522], [1.78902246E12, 196.5026525198939], [1.78902276E12, 131.354926299457]], "isOverall": false, "label": "GET stress_test.jsp", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78902276E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 124.36888888888912, "minX": 1.78902246E12, "maxY": 196.37002652519885, "series": [{"data": [[1.78902264E12, 131.11830047209077], [1.7890227E12, 124.36888888888912], [1.78902252E12, 138.99044499044516], [1.78902258E12, 133.18101054969495], [1.78902246E12, 196.37002652519885], [1.78902276E12, 131.25640031031853]], "isOverall": false, "label": "GET stress_test.jsp", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78902276E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 6.4887531241321845, "minX": 1.78902246E12, "maxY": 8.848806366047755, "series": [{"data": [[1.78902264E12, 6.4887531241321845], [1.7890227E12, 6.55472222222221], [1.78902252E12, 6.963690963690969], [1.78902258E12, 6.654636313159354], [1.78902246E12, 8.848806366047755], [1.78902276E12, 7.638867339022492]], "isOverall": false, "label": "GET stress_test.jsp", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78902276E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 62.0, "minX": 1.78902246E12, "maxY": 2268.0, "series": [{"data": [[1.78902264E12, 1381.0], [1.7890227E12, 1128.0], [1.78902252E12, 1611.0], [1.78902258E12, 947.0], [1.78902246E12, 2268.0], [1.78902276E12, 1225.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.78902264E12, 190.0], [1.7890227E12, 182.0], [1.78902252E12, 208.0], [1.78902258E12, 200.0], [1.78902246E12, 271.0], [1.78902276E12, 191.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.78902264E12, 542.94], [1.7890227E12, 332.9599999999991], [1.78902252E12, 466.3600000000001], [1.78902258E12, 464.9399999999996], [1.78902246E12, 1728.5000000000086], [1.78902276E12, 420.6800000000003]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.78902264E12, 237.89999999999964], [1.7890227E12, 218.0], [1.78902252E12, 257.0], [1.78902258E12, 252.0], [1.78902246E12, 355.0], [1.78902276E12, 246.0]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.78902264E12, 63.0], [1.7890227E12, 64.0], [1.78902252E12, 64.0], [1.78902258E12, 62.0], [1.78902246E12, 92.0], [1.78902276E12, 65.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.78902264E12, 111.0], [1.7890227E12, 111.0], [1.78902252E12, 118.0], [1.78902258E12, 114.0], [1.78902246E12, 146.0], [1.78902276E12, 114.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78902276E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 107.5, "minX": 1.0, "maxY": 326.5, "series": [{"data": [[2.0, 326.5], [33.0, 140.0], [36.0, 163.5], [43.0, 153.0], [45.0, 123.0], [44.0, 124.5], [46.0, 111.5], [48.0, 147.0], [50.0, 117.0], [51.0, 117.5], [53.0, 113.0], [52.0, 113.0], [54.0, 117.5], [55.0, 112.0], [56.0, 112.0], [57.0, 110.0], [59.0, 112.0], [58.0, 114.0], [60.0, 114.0], [61.0, 115.0], [63.0, 117.0], [62.0, 116.0], [65.0, 117.5], [67.0, 114.0], [64.0, 114.0], [66.0, 107.5], [68.0, 119.5], [70.0, 132.5], [69.0, 164.0], [78.0, 115.5], [76.0, 144.0], [6.0, 311.0], [1.0, 237.0], [19.0, 154.0], [20.0, 200.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 78.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 107.0, "minX": 1.0, "maxY": 325.0, "series": [{"data": [[2.0, 325.0], [33.0, 140.0], [36.0, 163.5], [43.0, 153.0], [45.0, 123.0], [44.0, 123.5], [46.0, 111.5], [48.0, 147.0], [50.0, 117.0], [51.0, 117.5], [53.0, 113.0], [52.0, 113.0], [54.0, 117.5], [55.0, 112.0], [56.0, 112.0], [57.0, 110.0], [59.0, 112.0], [58.0, 114.0], [60.0, 114.0], [61.0, 115.0], [63.0, 117.0], [62.0, 116.0], [65.0, 117.5], [67.0, 114.0], [64.0, 114.0], [66.0, 107.0], [68.0, 119.5], [70.0, 132.5], [69.0, 164.0], [78.0, 115.5], [76.0, 144.0], [6.0, 311.0], [1.0, 237.0], [19.0, 154.0], [20.0, 200.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 78.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 12.7, "minX": 1.78902246E12, "maxY": 61.03333333333333, "series": [{"data": [[1.78902264E12, 60.0], [1.7890227E12, 60.0], [1.78902252E12, 61.03333333333333], [1.78902258E12, 60.0], [1.78902246E12, 12.7], [1.78902276E12, 42.9]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78902276E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 12.566666666666666, "minX": 1.78902246E12, "maxY": 61.05, "series": [{"data": [[1.78902264E12, 60.016666666666666], [1.7890227E12, 60.0], [1.78902252E12, 61.05], [1.78902258E12, 60.03333333333333], [1.78902246E12, 12.566666666666666], [1.78902276E12, 42.96666666666667]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78902276E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 12.566666666666666, "minX": 1.78902246E12, "maxY": 61.05, "series": [{"data": [[1.78902264E12, 60.016666666666666], [1.7890227E12, 60.0], [1.78902252E12, 61.05], [1.78902258E12, 60.03333333333333], [1.78902246E12, 12.566666666666666], [1.78902276E12, 42.96666666666667]], "isOverall": false, "label": "GET stress_test.jsp-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78902276E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 12.566666666666666, "minX": 1.78902246E12, "maxY": 61.05, "series": [{"data": [[1.78902264E12, 60.016666666666666], [1.7890227E12, 60.0], [1.78902252E12, 61.05], [1.78902258E12, 60.03333333333333], [1.78902246E12, 12.566666666666666], [1.78902276E12, 42.96666666666667]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78902276E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

