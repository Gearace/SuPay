input不输入时是undefine
type = number时， 输入非数字自动转换为null， 不输入是
type = text时， 空字符是 ""



//检索filter输入防抖动
//    var timeout;
//    $scope.$watch('search.py', function (newVal, oldval) {
//        if (newVal === oldval || newVal == "" || _.isUndefined(newVal)) {
//            return;
//        } else {
//            if (timeout) $timeout.cancel(timeout);
//            timeout = $timeout(function () {
//                $scope.search.query = newVal;//具体检索内容
//            }, 500);
//        }
//    });

/*本段为最初采用html5 sqlite实现，但在手机上响应速度一般，故采用localStorage实现
                        // 登录成功后加载菜品目录，先发起索取菜品版本请求，再根据本地版本来判断是否更新。
                        var db = new lanxDB('CartDB');
                        db.init('vegetables', [{name: 'id',type: 'integer primary key autoincrement'}, {name: 'AKB020',type: 'text'}, {name: 'ADA001',type: 'text'}, {name: 'ADA003',type: 'text'}, {name: 'py',type: 'text'}, {name: 'ADA004',type: 'text'}, {name: 'ADA005',type: 'text'}, {name: 'ADA006',type: 'text'}, {name: 'AKC225',type: 'text'}, {name: 'ADA030',type: 'text'}, {name: 'ADA031',type: 'text'}]);
                        // db.dropTable();
                        db.getData(function (result) {
                            // 如果本地含有数据将结果直接放入本地session，如果本地没数据通过下面的插入数据库调用
                            sessionStorage.setItem('vegetables', JSON.stringify(result));
                            var vgtversion = _.isUndefined(result[0].ADA030) ? 0: result[0].ADA030;
                            path = 'procedure/queryselleritem';
                            args = 'AKB020=' + user.ORG_CODE + '&ADA030=' + vgtversion;
                            AjaxService.doRequest(path, args)
                                .success(function (data2, status, headers, config) {
                                    if (data2.err == "") {
                                        var vegetables = angular.copy(data2.data);
                                        // 根据服务器返回的数据长度来确定是否更新数据
                                        if (vegetables.length > 0) {
                                            // 删除session的菜品目录
                                            sessionStorage.removeItem('vegetables');
                                            // 为每个菜品加入拼音
                                            var pyhelp = new pinyin();
                                            for (var i = 0; i < vegetables.length; i++) {
                                                var name = vegetables[i].ADA003
                                                var shortPY = pyhelp.getCamelChars(name).toLowerCase();
                                                var fullPY = pyhelp.getFullChars(name).toLowerCase();
                                                vegetables[i].py = shortPY + "|" + fullPY;
                                            }
                                            // 减少与服务器交互和代码处理复杂度，直接将原数据表删除，再新建插入。
                                            db.dropTable();
                                            db.init('vegetables', [{name: 'id',type: 'integer primary key autoincrement'}, {name: 'AKB020',type: 'text'}, {name: 'ADA001',type: 'text'}, {name: 'ADA003',type: 'text'}, {name: 'py',type: 'text'}, {name: 'ADA004',type: 'text'}, {name: 'ADA005',type: 'text'}, {name: 'ADA006',type: 'text'}, {name: 'AKC225',type: 'text'}, {name: 'ADA030',type: 'text'}, {name: 'ADA031',type: 'text'}]);
                                            db.insertData(vegetables);
                                            sessionStorage.setItem('vegetables', JSON.stringify(vegetables));
                                        }
                                        // 成功跳转菜品目录页面
                                        $state.go('tab.cart', {
                                            initFlag: "init"
                                        });
                                    } else {
                                        $ionicPopup.alert({
                                            title: '数据内容异常！',
                                            content: data.err
                                        });
                                    }
                                });
                        });
*/