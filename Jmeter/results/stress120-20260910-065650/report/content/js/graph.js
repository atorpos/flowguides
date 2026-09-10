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
        data: {"result": {"minY": 57.0, "minX": 0.0, "maxY": 3903.0, "series": [{"data": [[0.0, 57.0], [0.1, 60.0], [0.2, 61.0], [0.3, 62.0], [0.4, 62.0], [0.5, 63.0], [0.6, 63.0], [0.7, 63.0], [0.8, 63.0], [0.9, 64.0], [1.0, 64.0], [1.1, 64.0], [1.2, 64.0], [1.3, 64.0], [1.4, 65.0], [1.5, 65.0], [1.6, 65.0], [1.7, 65.0], [1.8, 65.0], [1.9, 65.0], [2.0, 65.0], [2.1, 65.0], [2.2, 66.0], [2.3, 66.0], [2.4, 66.0], [2.5, 66.0], [2.6, 66.0], [2.7, 66.0], [2.8, 66.0], [2.9, 66.0], [3.0, 66.0], [3.1, 66.0], [3.2, 67.0], [3.3, 67.0], [3.4, 67.0], [3.5, 67.0], [3.6, 67.0], [3.7, 67.0], [3.8, 67.0], [3.9, 67.0], [4.0, 67.0], [4.1, 67.0], [4.2, 67.0], [4.3, 68.0], [4.4, 68.0], [4.5, 68.0], [4.6, 68.0], [4.7, 68.0], [4.8, 68.0], [4.9, 68.0], [5.0, 68.0], [5.1, 68.0], [5.2, 68.0], [5.3, 68.0], [5.4, 68.0], [5.5, 68.0], [5.6, 69.0], [5.7, 69.0], [5.8, 69.0], [5.9, 69.0], [6.0, 69.0], [6.1, 69.0], [6.2, 69.0], [6.3, 69.0], [6.4, 69.0], [6.5, 69.0], [6.6, 69.0], [6.7, 69.0], [6.8, 69.0], [6.9, 69.0], [7.0, 69.0], [7.1, 70.0], [7.2, 70.0], [7.3, 70.0], [7.4, 70.0], [7.5, 70.0], [7.6, 70.0], [7.7, 70.0], [7.8, 70.0], [7.9, 70.0], [8.0, 70.0], [8.1, 70.0], [8.2, 70.0], [8.3, 70.0], [8.4, 70.0], [8.5, 70.0], [8.6, 70.0], [8.7, 71.0], [8.8, 71.0], [8.9, 71.0], [9.0, 71.0], [9.1, 71.0], [9.2, 71.0], [9.3, 71.0], [9.4, 71.0], [9.5, 71.0], [9.6, 71.0], [9.7, 71.0], [9.8, 71.0], [9.9, 71.0], [10.0, 71.0], [10.1, 71.0], [10.2, 71.0], [10.3, 72.0], [10.4, 72.0], [10.5, 72.0], [10.6, 72.0], [10.7, 72.0], [10.8, 72.0], [10.9, 72.0], [11.0, 72.0], [11.1, 72.0], [11.2, 72.0], [11.3, 72.0], [11.4, 72.0], [11.5, 72.0], [11.6, 72.0], [11.7, 72.0], [11.8, 72.0], [11.9, 73.0], [12.0, 73.0], [12.1, 73.0], [12.2, 73.0], [12.3, 73.0], [12.4, 73.0], [12.5, 73.0], [12.6, 73.0], [12.7, 73.0], [12.8, 73.0], [12.9, 73.0], [13.0, 73.0], [13.1, 73.0], [13.2, 73.0], [13.3, 73.0], [13.4, 73.0], [13.5, 74.0], [13.6, 74.0], [13.7, 74.0], [13.8, 74.0], [13.9, 74.0], [14.0, 74.0], [14.1, 74.0], [14.2, 74.0], [14.3, 74.0], [14.4, 74.0], [14.5, 74.0], [14.6, 74.0], [14.7, 74.0], [14.8, 74.0], [14.9, 74.0], [15.0, 75.0], [15.1, 75.0], [15.2, 75.0], [15.3, 75.0], [15.4, 75.0], [15.5, 75.0], [15.6, 75.0], [15.7, 75.0], [15.8, 75.0], [15.9, 75.0], [16.0, 75.0], [16.1, 75.0], [16.2, 75.0], [16.3, 75.0], [16.4, 75.0], [16.5, 76.0], [16.6, 76.0], [16.7, 76.0], [16.8, 76.0], [16.9, 76.0], [17.0, 76.0], [17.1, 76.0], [17.2, 76.0], [17.3, 76.0], [17.4, 76.0], [17.5, 76.0], [17.6, 76.0], [17.7, 76.0], [17.8, 76.0], [17.9, 76.0], [18.0, 77.0], [18.1, 77.0], [18.2, 77.0], [18.3, 77.0], [18.4, 77.0], [18.5, 77.0], [18.6, 77.0], [18.7, 77.0], [18.8, 77.0], [18.9, 77.0], [19.0, 77.0], [19.1, 77.0], [19.2, 77.0], [19.3, 77.0], [19.4, 78.0], [19.5, 78.0], [19.6, 78.0], [19.7, 78.0], [19.8, 78.0], [19.9, 78.0], [20.0, 78.0], [20.1, 78.0], [20.2, 78.0], [20.3, 78.0], [20.4, 78.0], [20.5, 78.0], [20.6, 78.0], [20.7, 78.0], [20.8, 79.0], [20.9, 79.0], [21.0, 79.0], [21.1, 79.0], [21.2, 79.0], [21.3, 79.0], [21.4, 79.0], [21.5, 79.0], [21.6, 79.0], [21.7, 79.0], [21.8, 79.0], [21.9, 79.0], [22.0, 79.0], [22.1, 80.0], [22.2, 80.0], [22.3, 80.0], [22.4, 80.0], [22.5, 80.0], [22.6, 80.0], [22.7, 80.0], [22.8, 80.0], [22.9, 80.0], [23.0, 80.0], [23.1, 80.0], [23.2, 80.0], [23.3, 80.0], [23.4, 81.0], [23.5, 81.0], [23.6, 81.0], [23.7, 81.0], [23.8, 81.0], [23.9, 81.0], [24.0, 81.0], [24.1, 81.0], [24.2, 81.0], [24.3, 81.0], [24.4, 81.0], [24.5, 81.0], [24.6, 81.0], [24.7, 81.0], [24.8, 82.0], [24.9, 82.0], [25.0, 82.0], [25.1, 82.0], [25.2, 82.0], [25.3, 82.0], [25.4, 82.0], [25.5, 82.0], [25.6, 82.0], [25.7, 82.0], [25.8, 82.0], [25.9, 82.0], [26.0, 83.0], [26.1, 83.0], [26.2, 83.0], [26.3, 83.0], [26.4, 83.0], [26.5, 83.0], [26.6, 83.0], [26.7, 83.0], [26.8, 83.0], [26.9, 83.0], [27.0, 83.0], [27.1, 83.0], [27.2, 83.0], [27.3, 84.0], [27.4, 84.0], [27.5, 84.0], [27.6, 84.0], [27.7, 84.0], [27.8, 84.0], [27.9, 84.0], [28.0, 84.0], [28.1, 84.0], [28.2, 84.0], [28.3, 84.0], [28.4, 84.0], [28.5, 85.0], [28.6, 85.0], [28.7, 85.0], [28.8, 85.0], [28.9, 85.0], [29.0, 85.0], [29.1, 85.0], [29.2, 85.0], [29.3, 85.0], [29.4, 85.0], [29.5, 85.0], [29.6, 85.0], [29.7, 85.0], [29.8, 86.0], [29.9, 86.0], [30.0, 86.0], [30.1, 86.0], [30.2, 86.0], [30.3, 86.0], [30.4, 86.0], [30.5, 86.0], [30.6, 86.0], [30.7, 86.0], [30.8, 86.0], [30.9, 86.0], [31.0, 87.0], [31.1, 87.0], [31.2, 87.0], [31.3, 87.0], [31.4, 87.0], [31.5, 87.0], [31.6, 87.0], [31.7, 87.0], [31.8, 87.0], [31.9, 87.0], [32.0, 87.0], [32.1, 88.0], [32.2, 88.0], [32.3, 88.0], [32.4, 88.0], [32.5, 88.0], [32.6, 88.0], [32.7, 88.0], [32.8, 88.0], [32.9, 88.0], [33.0, 88.0], [33.1, 88.0], [33.2, 89.0], [33.3, 89.0], [33.4, 89.0], [33.5, 89.0], [33.6, 89.0], [33.7, 89.0], [33.8, 89.0], [33.9, 89.0], [34.0, 89.0], [34.1, 89.0], [34.2, 89.0], [34.3, 89.0], [34.4, 90.0], [34.5, 90.0], [34.6, 90.0], [34.7, 90.0], [34.8, 90.0], [34.9, 90.0], [35.0, 90.0], [35.1, 90.0], [35.2, 90.0], [35.3, 90.0], [35.4, 90.0], [35.5, 91.0], [35.6, 91.0], [35.7, 91.0], [35.8, 91.0], [35.9, 91.0], [36.0, 91.0], [36.1, 91.0], [36.2, 91.0], [36.3, 91.0], [36.4, 91.0], [36.5, 91.0], [36.6, 92.0], [36.7, 92.0], [36.8, 92.0], [36.9, 92.0], [37.0, 92.0], [37.1, 92.0], [37.2, 92.0], [37.3, 92.0], [37.4, 92.0], [37.5, 92.0], [37.6, 92.0], [37.7, 92.0], [37.8, 93.0], [37.9, 93.0], [38.0, 93.0], [38.1, 93.0], [38.2, 93.0], [38.3, 93.0], [38.4, 93.0], [38.5, 93.0], [38.6, 93.0], [38.7, 93.0], [38.8, 93.0], [38.9, 93.0], [39.0, 94.0], [39.1, 94.0], [39.2, 94.0], [39.3, 94.0], [39.4, 94.0], [39.5, 94.0], [39.6, 94.0], [39.7, 94.0], [39.8, 94.0], [39.9, 94.0], [40.0, 94.0], [40.1, 95.0], [40.2, 95.0], [40.3, 95.0], [40.4, 95.0], [40.5, 95.0], [40.6, 95.0], [40.7, 95.0], [40.8, 95.0], [40.9, 95.0], [41.0, 95.0], [41.1, 95.0], [41.2, 96.0], [41.3, 96.0], [41.4, 96.0], [41.5, 96.0], [41.6, 96.0], [41.7, 96.0], [41.8, 96.0], [41.9, 96.0], [42.0, 96.0], [42.1, 96.0], [42.2, 97.0], [42.3, 97.0], [42.4, 97.0], [42.5, 97.0], [42.6, 97.0], [42.7, 97.0], [42.8, 97.0], [42.9, 97.0], [43.0, 97.0], [43.1, 97.0], [43.2, 97.0], [43.3, 98.0], [43.4, 98.0], [43.5, 98.0], [43.6, 98.0], [43.7, 98.0], [43.8, 98.0], [43.9, 98.0], [44.0, 98.0], [44.1, 98.0], [44.2, 98.0], [44.3, 99.0], [44.4, 99.0], [44.5, 99.0], [44.6, 99.0], [44.7, 99.0], [44.8, 99.0], [44.9, 99.0], [45.0, 99.0], [45.1, 99.0], [45.2, 99.0], [45.3, 100.0], [45.4, 100.0], [45.5, 100.0], [45.6, 100.0], [45.7, 100.0], [45.8, 100.0], [45.9, 100.0], [46.0, 100.0], [46.1, 100.0], [46.2, 100.0], [46.3, 101.0], [46.4, 101.0], [46.5, 101.0], [46.6, 101.0], [46.7, 101.0], [46.8, 101.0], [46.9, 101.0], [47.0, 101.0], [47.1, 101.0], [47.2, 101.0], [47.3, 101.0], [47.4, 102.0], [47.5, 102.0], [47.6, 102.0], [47.7, 102.0], [47.8, 102.0], [47.9, 102.0], [48.0, 102.0], [48.1, 102.0], [48.2, 102.0], [48.3, 102.0], [48.4, 102.0], [48.5, 103.0], [48.6, 103.0], [48.7, 103.0], [48.8, 103.0], [48.9, 103.0], [49.0, 103.0], [49.1, 103.0], [49.2, 103.0], [49.3, 103.0], [49.4, 103.0], [49.5, 104.0], [49.6, 104.0], [49.7, 104.0], [49.8, 104.0], [49.9, 104.0], [50.0, 104.0], [50.1, 104.0], [50.2, 104.0], [50.3, 104.0], [50.4, 104.0], [50.5, 105.0], [50.6, 105.0], [50.7, 105.0], [50.8, 105.0], [50.9, 105.0], [51.0, 105.0], [51.1, 105.0], [51.2, 105.0], [51.3, 105.0], [51.4, 106.0], [51.5, 106.0], [51.6, 106.0], [51.7, 106.0], [51.8, 106.0], [51.9, 106.0], [52.0, 106.0], [52.1, 106.0], [52.2, 106.0], [52.3, 106.0], [52.4, 107.0], [52.5, 107.0], [52.6, 107.0], [52.7, 107.0], [52.8, 107.0], [52.9, 107.0], [53.0, 107.0], [53.1, 107.0], [53.2, 107.0], [53.3, 107.0], [53.4, 108.0], [53.5, 108.0], [53.6, 108.0], [53.7, 108.0], [53.8, 108.0], [53.9, 108.0], [54.0, 108.0], [54.1, 108.0], [54.2, 108.0], [54.3, 109.0], [54.4, 109.0], [54.5, 109.0], [54.6, 109.0], [54.7, 109.0], [54.8, 109.0], [54.9, 109.0], [55.0, 109.0], [55.1, 109.0], [55.2, 110.0], [55.3, 110.0], [55.4, 110.0], [55.5, 110.0], [55.6, 110.0], [55.7, 110.0], [55.8, 110.0], [55.9, 111.0], [56.0, 111.0], [56.1, 111.0], [56.2, 111.0], [56.3, 111.0], [56.4, 111.0], [56.5, 111.0], [56.6, 111.0], [56.7, 111.0], [56.8, 112.0], [56.9, 112.0], [57.0, 112.0], [57.1, 112.0], [57.2, 112.0], [57.3, 112.0], [57.4, 112.0], [57.5, 112.0], [57.6, 112.0], [57.7, 113.0], [57.8, 113.0], [57.9, 113.0], [58.0, 113.0], [58.1, 113.0], [58.2, 113.0], [58.3, 113.0], [58.4, 113.0], [58.5, 114.0], [58.6, 114.0], [58.7, 114.0], [58.8, 114.0], [58.9, 114.0], [59.0, 114.0], [59.1, 114.0], [59.2, 114.0], [59.3, 115.0], [59.4, 115.0], [59.5, 115.0], [59.6, 115.0], [59.7, 115.0], [59.8, 115.0], [59.9, 115.0], [60.0, 115.0], [60.1, 116.0], [60.2, 116.0], [60.3, 116.0], [60.4, 116.0], [60.5, 116.0], [60.6, 116.0], [60.7, 116.0], [60.8, 116.0], [60.9, 117.0], [61.0, 117.0], [61.1, 117.0], [61.2, 117.0], [61.3, 117.0], [61.4, 117.0], [61.5, 117.0], [61.6, 117.0], [61.7, 118.0], [61.8, 118.0], [61.9, 118.0], [62.0, 118.0], [62.1, 118.0], [62.2, 118.0], [62.3, 118.0], [62.4, 119.0], [62.5, 119.0], [62.6, 119.0], [62.7, 119.0], [62.8, 119.0], [62.9, 119.0], [63.0, 119.0], [63.1, 119.0], [63.2, 119.0], [63.3, 120.0], [63.4, 120.0], [63.5, 120.0], [63.6, 120.0], [63.7, 120.0], [63.8, 120.0], [63.9, 120.0], [64.0, 120.0], [64.1, 121.0], [64.2, 121.0], [64.3, 121.0], [64.4, 121.0], [64.5, 121.0], [64.6, 121.0], [64.7, 121.0], [64.8, 122.0], [64.9, 122.0], [65.0, 122.0], [65.1, 122.0], [65.2, 122.0], [65.3, 122.0], [65.4, 122.0], [65.5, 123.0], [65.6, 123.0], [65.7, 123.0], [65.8, 123.0], [65.9, 123.0], [66.0, 123.0], [66.1, 123.0], [66.2, 124.0], [66.3, 124.0], [66.4, 124.0], [66.5, 124.0], [66.6, 124.0], [66.7, 124.0], [66.8, 124.0], [66.9, 125.0], [67.0, 125.0], [67.1, 125.0], [67.2, 125.0], [67.3, 125.0], [67.4, 125.0], [67.5, 126.0], [67.6, 126.0], [67.7, 126.0], [67.8, 126.0], [67.9, 126.0], [68.0, 126.0], [68.1, 126.0], [68.2, 127.0], [68.3, 127.0], [68.4, 127.0], [68.5, 127.0], [68.6, 127.0], [68.7, 127.0], [68.8, 128.0], [68.9, 128.0], [69.0, 128.0], [69.1, 128.0], [69.2, 128.0], [69.3, 128.0], [69.4, 129.0], [69.5, 129.0], [69.6, 129.0], [69.7, 129.0], [69.8, 129.0], [69.9, 129.0], [70.0, 130.0], [70.1, 130.0], [70.2, 130.0], [70.3, 130.0], [70.4, 130.0], [70.5, 130.0], [70.6, 131.0], [70.7, 131.0], [70.8, 131.0], [70.9, 131.0], [71.0, 131.0], [71.1, 131.0], [71.2, 132.0], [71.3, 132.0], [71.4, 132.0], [71.5, 132.0], [71.6, 132.0], [71.7, 133.0], [71.8, 133.0], [71.9, 133.0], [72.0, 133.0], [72.1, 133.0], [72.2, 134.0], [72.3, 134.0], [72.4, 134.0], [72.5, 134.0], [72.6, 134.0], [72.7, 135.0], [72.8, 135.0], [72.9, 135.0], [73.0, 135.0], [73.1, 135.0], [73.2, 135.0], [73.3, 136.0], [73.4, 136.0], [73.5, 136.0], [73.6, 136.0], [73.7, 137.0], [73.8, 137.0], [73.9, 137.0], [74.0, 137.0], [74.1, 137.0], [74.2, 137.0], [74.3, 138.0], [74.4, 138.0], [74.5, 138.0], [74.6, 138.0], [74.7, 139.0], [74.8, 139.0], [74.9, 139.0], [75.0, 139.0], [75.1, 139.0], [75.2, 140.0], [75.3, 140.0], [75.4, 140.0], [75.5, 140.0], [75.6, 140.0], [75.7, 141.0], [75.8, 141.0], [75.9, 141.0], [76.0, 141.0], [76.1, 142.0], [76.2, 142.0], [76.3, 142.0], [76.4, 142.0], [76.5, 142.0], [76.6, 143.0], [76.7, 143.0], [76.8, 143.0], [76.9, 143.0], [77.0, 144.0], [77.1, 144.0], [77.2, 144.0], [77.3, 144.0], [77.4, 145.0], [77.5, 145.0], [77.6, 145.0], [77.7, 145.0], [77.8, 146.0], [77.9, 146.0], [78.0, 146.0], [78.1, 147.0], [78.2, 147.0], [78.3, 147.0], [78.4, 147.0], [78.5, 148.0], [78.6, 148.0], [78.7, 148.0], [78.8, 148.0], [78.9, 149.0], [79.0, 149.0], [79.1, 149.0], [79.2, 149.0], [79.3, 150.0], [79.4, 150.0], [79.5, 150.0], [79.6, 151.0], [79.7, 151.0], [79.8, 151.0], [79.9, 151.0], [80.0, 152.0], [80.1, 152.0], [80.2, 152.0], [80.3, 152.0], [80.4, 153.0], [80.5, 153.0], [80.6, 153.0], [80.7, 154.0], [80.8, 154.0], [80.9, 154.0], [81.0, 155.0], [81.1, 155.0], [81.2, 155.0], [81.3, 155.0], [81.4, 156.0], [81.5, 156.0], [81.6, 156.0], [81.7, 157.0], [81.8, 157.0], [81.9, 157.0], [82.0, 158.0], [82.1, 158.0], [82.2, 158.0], [82.3, 159.0], [82.4, 159.0], [82.5, 159.0], [82.6, 160.0], [82.7, 160.0], [82.8, 160.0], [82.9, 161.0], [83.0, 161.0], [83.1, 162.0], [83.2, 162.0], [83.3, 162.0], [83.4, 163.0], [83.5, 163.0], [83.6, 164.0], [83.7, 164.0], [83.8, 164.0], [83.9, 165.0], [84.0, 165.0], [84.1, 166.0], [84.2, 166.0], [84.3, 167.0], [84.4, 167.0], [84.5, 167.0], [84.6, 168.0], [84.7, 168.0], [84.8, 169.0], [84.9, 169.0], [85.0, 170.0], [85.1, 170.0], [85.2, 170.0], [85.3, 171.0], [85.4, 171.0], [85.5, 172.0], [85.6, 172.0], [85.7, 173.0], [85.8, 174.0], [85.9, 174.0], [86.0, 175.0], [86.1, 175.0], [86.2, 176.0], [86.3, 176.0], [86.4, 177.0], [86.5, 177.0], [86.6, 178.0], [86.7, 178.0], [86.8, 179.0], [86.9, 180.0], [87.0, 180.0], [87.1, 181.0], [87.2, 181.0], [87.3, 182.0], [87.4, 182.0], [87.5, 183.0], [87.6, 184.0], [87.7, 184.0], [87.8, 185.0], [87.9, 185.0], [88.0, 186.0], [88.1, 186.0], [88.2, 187.0], [88.3, 188.0], [88.4, 188.0], [88.5, 189.0], [88.6, 189.0], [88.7, 190.0], [88.8, 191.0], [88.9, 191.0], [89.0, 192.0], [89.1, 193.0], [89.2, 193.0], [89.3, 194.0], [89.4, 195.0], [89.5, 195.0], [89.6, 196.0], [89.7, 197.0], [89.8, 198.0], [89.9, 198.0], [90.0, 200.0], [90.1, 200.0], [90.2, 201.0], [90.3, 202.0], [90.4, 203.0], [90.5, 203.0], [90.6, 204.0], [90.7, 205.0], [90.8, 206.0], [90.9, 207.0], [91.0, 208.0], [91.1, 209.0], [91.2, 210.0], [91.3, 211.0], [91.4, 212.0], [91.5, 213.0], [91.6, 215.0], [91.7, 216.0], [91.8, 217.0], [91.9, 219.0], [92.0, 220.0], [92.1, 221.0], [92.2, 223.0], [92.3, 223.0], [92.4, 225.0], [92.5, 227.0], [92.6, 228.0], [92.7, 230.0], [92.8, 231.0], [92.9, 232.0], [93.0, 234.0], [93.1, 235.0], [93.2, 237.0], [93.3, 238.0], [93.4, 240.0], [93.5, 242.0], [93.6, 244.0], [93.7, 247.0], [93.8, 249.0], [93.9, 251.0], [94.0, 253.0], [94.1, 256.0], [94.2, 258.0], [94.3, 261.0], [94.4, 263.0], [94.5, 265.0], [94.6, 269.0], [94.7, 271.0], [94.8, 274.0], [94.9, 278.0], [95.0, 281.0], [95.1, 285.0], [95.2, 289.0], [95.3, 293.0], [95.4, 296.0], [95.5, 301.0], [95.6, 305.0], [95.7, 309.0], [95.8, 314.0], [95.9, 320.0], [96.0, 326.0], [96.1, 333.0], [96.2, 337.0], [96.3, 344.0], [96.4, 350.0], [96.5, 360.0], [96.6, 369.0], [96.7, 377.0], [96.8, 387.0], [96.9, 396.0], [97.0, 407.0], [97.1, 419.0], [97.2, 430.0], [97.3, 447.0], [97.4, 463.0], [97.5, 479.0], [97.6, 494.0], [97.7, 511.0], [97.8, 537.0], [97.9, 557.0], [98.0, 573.0], [98.1, 597.0], [98.2, 624.0], [98.3, 664.0], [98.4, 704.0], [98.5, 747.0], [98.6, 784.0], [98.7, 848.0], [98.8, 917.0], [98.9, 1001.0], [99.0, 1068.0], [99.1, 1129.0], [99.2, 1215.0], [99.3, 1288.0], [99.4, 1418.0], [99.5, 1528.0], [99.6, 1622.0], [99.7, 1751.0], [99.8, 1884.0], [99.9, 2135.0]], "isOverall": false, "label": "GET stress_test.jsp", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 15789.0, "series": [{"data": [[0.0, 15789.0], [600.0, 98.0], [700.0, 79.0], [800.0, 55.0], [900.0, 41.0], [1000.0, 54.0], [1100.0, 42.0], [1200.0, 48.0], [1300.0, 27.0], [1400.0, 27.0], [1500.0, 44.0], [100.0, 15602.0], [1600.0, 25.0], [1700.0, 29.0], [1800.0, 23.0], [1900.0, 15.0], [2000.0, 12.0], [2100.0, 16.0], [2300.0, 7.0], [2200.0, 5.0], [2400.0, 3.0], [2500.0, 3.0], [2700.0, 2.0], [200.0, 1910.0], [3300.0, 1.0], [3600.0, 1.0], [3900.0, 1.0], [300.0, 516.0], [400.0, 241.0], [500.0, 168.0]], "isOverall": false, "label": "GET stress_test.jsp", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 3900.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 187.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 34063.0, "series": [{"data": [[0.0, 34063.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 634.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 187.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 9.215805471124625, "minX": 1.78902336E12, "maxY": 100.0, "series": [{"data": [[1.7890236E12, 100.0], [1.78902366E12, 99.06060126582283], [1.78902348E12, 100.0], [1.78902354E12, 100.0], [1.78902336E12, 9.215805471124625], [1.78902342E12, 63.95752672637971]], "isOverall": false, "label": "Stress Thread Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78902366E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 78.22368421052632, "minX": 1.0, "maxY": 509.2, "series": [{"data": [[2.0, 132.75], [3.0, 509.2], [4.0, 158.59999999999997], [5.0, 153.8], [6.0, 144.56], [7.0, 137.9705882352941], [8.0, 121.7027027027027], [9.0, 214.04166666666666], [10.0, 165.7368421052631], [11.0, 150.0454545454546], [12.0, 144.35416666666663], [13.0, 149.44897959183672], [14.0, 136.1612903225806], [15.0, 197.28571428571433], [16.0, 164.9642857142857], [17.0, 143.54385964912285], [18.0, 290.5909090909091], [19.0, 282.76744186046517], [20.0, 231.85714285714278], [21.0, 148.05714285714288], [22.0, 147.88405797101447], [23.0, 155.26760563380284], [24.0, 137.33846153846156], [25.0, 141.95000000000005], [26.0, 151.51428571428573], [27.0, 146.75342465753428], [28.0, 133.7142857142857], [29.0, 135.72222222222217], [30.0, 134.02739726027391], [31.0, 152.7457627118644], [32.0, 226.55714285714288], [33.0, 174.1216216216217], [34.0, 137.46575342465744], [35.0, 138.67647058823528], [36.0, 131.81159420289856], [37.0, 226.87096774193552], [38.0, 126.9047619047619], [39.0, 444.7833333333333], [40.0, 228.0657894736842], [41.0, 121.52054794520545], [42.0, 103.69444444444443], [43.0, 109.3333333333333], [44.0, 109.36842105263158], [45.0, 118.0810810810811], [46.0, 109.3529411764706], [47.0, 390.4509803921568], [48.0, 183.3917525773196], [49.0, 120.69230769230768], [50.0, 136.49367088607593], [51.0, 123.69014084507042], [52.0, 114.67105263157892], [53.0, 116.05405405405405], [54.0, 122.71212121212125], [55.0, 127.61627906976747], [56.0, 83.55844155844156], [57.0, 86.0405405405405], [58.0, 90.02597402597402], [59.0, 79.58333333333331], [60.0, 82.22784810126579], [61.0, 84.73611111111116], [62.0, 85.68571428571428], [63.0, 85.10256410256409], [64.0, 86.17808219178083], [65.0, 80.63513513513516], [66.0, 79.57894736842105], [67.0, 84.10526315789477], [68.0, 80.29333333333332], [69.0, 83.87179487179486], [70.0, 81.65753424657534], [71.0, 98.20547945205482], [72.0, 122.78082191780823], [73.0, 82.90410958904111], [74.0, 87.51948051948045], [75.0, 96.92207792207795], [76.0, 87.31578947368418], [77.0, 87.7948717948718], [78.0, 122.57746478873239], [79.0, 102.74647887323941], [80.0, 91.58571428571426], [81.0, 94.17721518987342], [82.0, 84.55405405405402], [83.0, 78.22368421052632], [84.0, 92.89393939393936], [85.0, 110.36486486486484], [86.0, 101.8625], [87.0, 101.7361111111111], [88.0, 92.07999999999998], [89.0, 149.98507462686564], [90.0, 129.86301369863014], [91.0, 150.2151898734177], [92.0, 121.41666666666666], [93.0, 135.20289855072465], [94.0, 124.70588235294117], [95.0, 94.85714285714283], [96.0, 93.72839506172838], [97.0, 92.94805194805193], [98.0, 87.56164383561642], [99.0, 80.2054794520548], [100.0, 145.4368918396739], [1.0, 313.0]], "isOverall": false, "label": "GET stress_test.jsp", "isController": false}, {"data": [[91.82172342621197, 142.13112028437067]], "isOverall": false, "label": "GET stress_test.jsp-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 3081.633333333333, "minX": 1.78902336E12, "maxY": 733393.95, "series": [{"data": [[1.7890236E12, 709066.2666666667], [1.78902366E12, 643310.1166666667], [1.78902348E12, 726981.2666666667], [1.78902354E12, 733393.95], [1.78902336E12, 33488.76666666667], [1.78902342E12, 704587.5]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.7890236E12, 65248.2], [1.78902366E12, 59197.333333333336], [1.78902348E12, 66896.73333333334], [1.78902354E12, 67486.83333333333], [1.78902336E12, 3081.633333333333], [1.78902342E12, 64836.066666666666]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78902366E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 123.16914556962001, "minX": 1.78902336E12, "maxY": 184.76701119724493, "series": [{"data": [[1.7890236E12, 184.76701119724493], [1.78902366E12, 123.16914556962001], [1.78902348E12, 144.36110333239915], [1.78902354E12, 125.70034698126338], [1.78902336E12, 157.94528875379967], [1.78902342E12, 130.58711355099607]], "isOverall": false, "label": "GET stress_test.jsp", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78902366E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 123.07484177215197, "minX": 1.78902336E12, "maxY": 184.67987367212234, "series": [{"data": [[1.7890236E12, 184.67987367212234], [1.78902366E12, 123.07484177215197], [1.78902348E12, 144.26631195743573], [1.78902354E12, 125.60485773768225], [1.78902336E12, 157.7811550151976], [1.78902342E12, 130.47457382259438]], "isOverall": false, "label": "GET stress_test.jsp", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78902366E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 6.262499999999999, "minX": 1.78902336E12, "maxY": 9.620060790273556, "series": [{"data": [[1.7890236E12, 6.3016078093597425], [1.78902366E12, 6.262499999999999], [1.78902348E12, 6.50028003360404], [1.78902354E12, 6.379736294240114], [1.78902336E12, 9.620060790273556], [1.78902342E12, 6.408119040739643]], "isOverall": false, "label": "GET stress_test.jsp", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78902366E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 57.0, "minX": 1.78902336E12, "maxY": 3903.0, "series": [{"data": [[1.7890236E12, 3903.0], [1.78902366E12, 1099.0], [1.78902348E12, 2509.0], [1.78902354E12, 1180.0], [1.78902336E12, 1076.0], [1.78902342E12, 2032.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.7890236E12, 240.0], [1.78902366E12, 186.0], [1.78902348E12, 204.0], [1.78902354E12, 189.0], [1.78902336E12, 229.0], [1.78902342E12, 190.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.7890236E12, 1782.6599999999999], [1.78902366E12, 398.0], [1.78902348E12, 1171.5599999999977], [1.78902354E12, 547.9399999999996], [1.78902336E12, 589.3999999999992], [1.78902342E12, 837.539999999999]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.7890236E12, 638.1999999999971], [1.78902366E12, 230.0], [1.78902348E12, 280.0], [1.78902354E12, 260.0], [1.78902336E12, 308.5], [1.78902342E12, 266.0]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.7890236E12, 58.0], [1.78902366E12, 61.0], [1.78902348E12, 59.0], [1.78902354E12, 59.0], [1.78902336E12, 70.0], [1.78902342E12, 57.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.7890236E12, 107.0], [1.78902366E12, 106.0], [1.78902348E12, 108.0], [1.78902354E12, 103.0], [1.78902336E12, 137.0], [1.78902342E12, 96.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78902366E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 82.0, "minX": 2.0, "maxY": 468.0, "series": [{"data": [[2.0, 275.0], [5.0, 468.0], [26.0, 150.5], [40.0, 139.0], [45.0, 164.0], [55.0, 87.0], [59.0, 115.0], [63.0, 155.0], [62.0, 88.0], [67.0, 130.5], [71.0, 149.0], [73.0, 187.0], [75.0, 113.0], [81.0, 123.0], [82.0, 123.5], [80.0, 92.5], [83.0, 124.0], [87.0, 142.5], [86.0, 82.0], [85.0, 109.0], [90.0, 150.0], [89.0, 100.0], [95.0, 91.0], [93.0, 125.5], [97.0, 134.5], [96.0, 111.5], [98.0, 172.0], [100.0, 123.0], [102.0, 423.0], [103.0, 106.0], [105.0, 104.5], [104.0, 118.5], [106.0, 108.0], [107.0, 108.5], [108.0, 120.5], [111.0, 99.0], [110.0, 103.0], [109.0, 110.0], [115.0, 104.0], [114.0, 101.0], [113.0, 111.0], [112.0, 92.0], [118.0, 104.0], [119.0, 102.0], [117.0, 112.0], [116.0, 91.0], [120.0, 99.0], [121.0, 105.0], [123.0, 97.0], [122.0, 102.0], [124.0, 99.0], [127.0, 95.0], [126.0, 93.0], [125.0, 93.0], [131.0, 111.0], [133.0, 106.0], [128.0, 104.0], [132.0, 104.0], [134.0, 103.5], [129.0, 97.0], [135.0, 107.0], [130.0, 98.5], [136.0, 106.0], [141.0, 101.0], [137.0, 117.0], [139.0, 93.0], [143.0, 90.0], [138.0, 108.0], [142.0, 91.5], [149.0, 97.0], [146.0, 142.0], [145.0, 143.5], [148.0, 147.5], [147.0, 117.0], [150.0, 99.5], [153.0, 223.0], [155.0, 219.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 155.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 81.5, "minX": 2.0, "maxY": 468.0, "series": [{"data": [[2.0, 273.0], [5.0, 468.0], [26.0, 150.0], [40.0, 139.0], [45.0, 164.0], [55.0, 87.0], [59.0, 115.0], [63.0, 155.0], [62.0, 88.0], [67.0, 130.5], [71.0, 149.0], [73.0, 187.0], [75.0, 113.0], [81.0, 123.0], [82.0, 123.5], [80.0, 92.5], [83.0, 123.0], [87.0, 142.5], [86.0, 81.5], [85.0, 109.0], [90.0, 149.5], [89.0, 99.0], [95.0, 91.0], [93.0, 125.5], [97.0, 134.5], [96.0, 111.0], [98.0, 172.0], [100.0, 123.0], [102.0, 423.0], [103.0, 106.0], [105.0, 104.5], [104.0, 118.0], [106.0, 108.0], [107.0, 108.0], [108.0, 120.5], [111.0, 99.0], [110.0, 102.5], [109.0, 110.0], [115.0, 104.0], [114.0, 101.0], [113.0, 111.0], [112.0, 92.0], [118.0, 104.0], [119.0, 102.0], [117.0, 112.0], [116.0, 91.0], [120.0, 99.0], [121.0, 105.0], [123.0, 97.0], [122.0, 102.0], [124.0, 99.0], [127.0, 95.0], [126.0, 93.0], [125.0, 92.5], [131.0, 111.0], [133.0, 106.0], [128.0, 104.0], [132.0, 104.0], [134.0, 103.5], [129.0, 97.0], [135.0, 107.0], [130.0, 98.0], [136.0, 106.0], [141.0, 101.0], [137.0, 117.0], [139.0, 93.0], [143.0, 90.0], [138.0, 108.0], [142.0, 91.5], [149.0, 97.0], [146.0, 142.0], [145.0, 143.5], [148.0, 147.5], [147.0, 117.0], [150.0, 99.5], [153.0, 223.0], [155.0, 219.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 155.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 5.7, "minX": 1.78902336E12, "maxY": 120.05, "series": [{"data": [[1.7890236E12, 116.05], [1.78902366E12, 105.18333333333334], [1.78902348E12, 118.95], [1.78902354E12, 120.05], [1.78902336E12, 5.7], [1.78902342E12, 115.46666666666667]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78902366E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 5.483333333333333, "minX": 1.78902336E12, "maxY": 120.08333333333333, "series": [{"data": [[1.7890236E12, 116.1], [1.78902366E12, 105.33333333333333], [1.78902348E12, 119.03333333333333], [1.78902354E12, 120.08333333333333], [1.78902336E12, 5.483333333333333], [1.78902342E12, 115.36666666666666]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78902366E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 5.483333333333333, "minX": 1.78902336E12, "maxY": 120.08333333333333, "series": [{"data": [[1.7890236E12, 116.1], [1.78902366E12, 105.33333333333333], [1.78902348E12, 119.03333333333333], [1.78902354E12, 120.08333333333333], [1.78902336E12, 5.483333333333333], [1.78902342E12, 115.36666666666666]], "isOverall": false, "label": "GET stress_test.jsp-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78902366E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 5.483333333333333, "minX": 1.78902336E12, "maxY": 120.08333333333333, "series": [{"data": [[1.7890236E12, 116.1], [1.78902366E12, 105.33333333333333], [1.78902348E12, 119.03333333333333], [1.78902354E12, 120.08333333333333], [1.78902336E12, 5.483333333333333], [1.78902342E12, 115.36666666666666]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78902366E12, "title": "Total Transactions Per Second"}},
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

