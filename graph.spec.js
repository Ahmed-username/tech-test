describe("graph.js", function(){
    it("returns min value in a list of exchange rates", function(){
        const data= {
            rates: {day1:{currency:9},day2:{currency:5},day3:{currency:2},
            day4:{currency:1},day5:{currency:4},day6:{currency:6},day7:{currency:3}}
        }
        expect(getMinRate(data)).toBe(1);

         const data2= {
            rates: {day1:{currency:200},day2:{currency:5},day3:{currency:2},
            day4:{currency:1},day5:{currency:4},day6:{currency:6},day7:{currency:-4}}
        }
        expect(getMinRate(data2)).toBe(-4);
    })

    it("magnifies a number to an integer of 3 digits", function(){
        const number1 = 0.000053694;
        expect(getY(number1)).toBe(536);

        const number2= 1.526353;
        
       

        expect(getY(number2)).toBe(152);
    })

    it("spies", function(){
         //console.log(getY(number2).arrayFromRate)
        
        // spyOn(getY(number2), "spy").andCallFake(function(){
        //     console.log("argu",arguments)
        // })

    //    const Y= spyOnProperty(getY(number2), "spy");
    spyOn(window, 'getY')
    

        // let mock = jasmine.createSpy('getY')
        // console.log("mock", mock)

        expect(window.getY).toHaveBeenCalledTimes(0)

    })

    xit("creates a list of nodes and a list of edges ", function(){
        const data= {
            rates: {day1:{currency:9},day2:{currency:5},day3:{currency:2},
            day4:{currency:1},day5:{currency:4},day6:{currency:6},day7:{currency:3}}
        }

    //    console.log("get jraph", drawGraph(data))
        
    })
})