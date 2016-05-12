/**
 * Created by Administrator on 2016/5/12.
 */

var Scope=function(){
    this.$$watchers=[];
};

Scope.prototype.$watch=function(watchExp,listener){
    this.$$watchers.push({
        watchExp:watchExp,
        listener:listener||function(){} //listener设置为一个空函数 – 这样一来可以$watch所有的变量
    });
};
Scope.prototype.$digest=function(){
    console.log("in");
   var dirty;
    do{
        dirty=false;

        for(var i=0;i<this.$$watchers.length;i++){
            var newValue=this.$$watchers[i].watchExp();
            console.log(newValue);
            var oldValue=this.$$watchers.last;
            console.log(oldValue);
            if(newValue!==oldValue)
            {
                this.$$watchers[i].listener(newValue,oldValue);
                dirty=true;
                this.$$watchers.last=newValue;
            }
        }
    }while(dirty);
};

var $scope=new Scope();
$scope.name="Ryan";

$scope.$watch(function(){
    return $scope.name;
},function(newValue,oldValue){
    console.log(newValue,oldValue);
});
$scope.$digest();

