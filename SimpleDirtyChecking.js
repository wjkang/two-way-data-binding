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
                this.$$watchers.last=newValue;
            }
            else
            {
                dirty=true;
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
//第一次循环Ryan!==undifined,Ryan复制给last,第二次循环脏值Flag设为true,不进行下一次循环再进行比较则相等，所以while循环了2次
$scope.$digest();

/*var element = document.querySelectorAll('input');

element[0].onkeyup = function() {
    $scope.name = element[0].value;

    $scope.$digest();
};

$scope.$watch(function(){
    return $scope.name;
}, function( newValue, oldValue ) {
    console.log('Input value updated - it is now ' + newValue);

    element[0].value = $scope.name;
} );

var updateScopeValue = function updateScopeValue( ) {
    $scope.name = 'Bob';
    $scope.$digest();
};*/

