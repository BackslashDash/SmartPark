/* Charles Owen
* Price model class for the manipulation and calclulation of dynamic pricing.
* Module suports API functions for getting dynamic price based 
* on 2 24-hour format input values; start, end, calculation of 
* hourly rate array based on admin defined values. 
*/
class PriceModelClass{
    constructor(model_name, base_rate, min_thresh, max_thresh, base_rate_mult, occupancy_percent, total_spots){
        this.model_name = model_name;      
        this.base_rate = base_rate;
        this.min_thresh = min_thresh;
        this.max_thresh = max_thresh;
        this.base_rate_mult = base_rate_mult;
        this.occupancy_percent = occupancy_percent;
        //this.hours_to_park = hours_to_park;
        this.total_spots = total_spots;
    }
    /*
    * Core feature of the class; the price formula itself.
    * See report 1 for detailed derivation.
    */
    priceFormula(occPer){
        if(occPer > this.min_thresh && occPer <= this.max_thresh){
        return (this.base_rate)*(1+(occPer-this.min_thresh)*((this.base_rate_mult-1)/(this.max_thresh-this.min_thresh)));
        }
        //This logic makes our function piecewise
        else if(occPer > this.max_thresh){
        return (this.base_rate)*(1+(this.max_thresh-this.min_thresh)*((this.base_rate_mult-1)/(this.max_thresh-this.min_thresh)));
        }
        return this.base_rate;
    }
    /*
    * Calculates price for every hour of the day
    * using the dynamic settings and returns 
    * those values in an array.
    */
    calculateHourlyRateArray(){
        let hourlyRates = [];
        let tempArr = this.occupancy_percent;
        for(let i=0; i<24; i++){
            hourlyRates.push((this.priceFormula(tempArr[i])).toFixed(2));
        }       
        return hourlyRates;
    }
    /*
    * Caculates price for every hour of the day 
    * using the base rate ONLY.
    */
    calculateHourlyRateArrayStatic(){
        let hourlyRates = [];
        let rate = this.base_rate;
        for(let i=0; i<24; i++){
            hourlyRates.push(rate);
        }
        return hourlyRates;
    }
    /*
    * Calculates total daily revenue with STATIC rates.
    */
    calculateTotalDailyRevenue(revenueArray){
        let revenue = 0;
        for(let i=0; i<24; i++){
            revenue += parseFloat(revenueArray[i]);
            console.log(revenue);
        }
        return revenue.toFixed(2);
    }
    /*
    * Calculates total daily revenue with DYNAMIC rates.
    * 
    */
    calculateDailyRevenue(hourlyRate, occuArr){
        let dailyRevArray = [];
        //this.occupancy_percent was working
        //let tempArr = occuArr;
        for(let i=0; i<24; i++){
            dailyRevArray.push((hourlyRate[i]*(occuArr[i]/100)*this.total_spots).toFixed(2));
            console.log(dailyRevArray);
        }
        return dailyRevArray;
    }
    /*
    * Calculates the price a custome should pay for parking
    * between two 24-hour formatted times.
    * Input as start, end and array of hourly rates.
    * Some code commented out, but kept for reference purposes.
    */
   customerPrice(start, end, hourlyRates){

        start = start.split(":");
        end = end.split(":");
        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
        //console.log(parseInt(start[0]));
        //console.log(parseInt(end[0]));
        //console.log(parseInt(end[0]));
        //console.log(hourlyRates);
        //console.log(start[1]);
        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = endDate.getTime() - startDate.getTime();
        var hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        var minutes = Math.floor(diff / 1000 / 60);

        if (hours < 0)
        hours = hours + 24;

        //iterate over the hours
        var charge = 0;
        for(let i = parseInt(start[0]); i<=parseInt(end[0]); i++){
            //console.log('hi');
            if(i == parseInt(start[0]) && parseInt(start[1]) > 0 && parseInt(start[1]) != 0){
                charge += (parseFloat(hourlyRates[i])*((60-start[1])/60));
                start[1]=0;
                //console.log(charge);
                continue;
            }
            if(i == parseInt(end[0]) && parseInt(end[1]) > 0 && parseInt(end[1]) != 0){
                charge += (parseFloat(hourlyRates[i])*(end[1]/60));
                end[1]=0;
                //console.log(charge);
                continue;
            }
            //This loop engages if no trailing minutes and at least an hour of time between the two values
            if((parseInt(start[1]) == 0 && parseInt(end[1]) == 0) && (parseInt(end[0])-parseInt(start[0]))>0){
                    for(let k = parseInt(start[0]); k<=parseInt(end[0])-1; k++){
                        charge += parseFloat(hourlyRates[k]);
                        //console.log(charge);
                        continue;
                    }
                    //JSON style return
                    return {price: "" + charge.toFixed(2)};
                    //String style return
                    //return charge.toFixed(2) + " for " + (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes + " hours";
            }
            charge += parseFloat(hourlyRates[i-1]);
        }
        //console.log(charge.toFixed(2));
        //JSON style return
        return {price: "" + charge.toFixed(2)};
        //String style return
        //return charge.toFixed(2) + " for " + (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes + " hours";
    }
        
   
   // changePercentageArray(){

   // }

}

module.exports = PriceModelClass;