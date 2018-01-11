'use strict';

angular.module('myApp.patientInfo', ['ngRoute'])

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'validationCtrl'
            })
            .when('/doctor', {
                templateUrl: 'views/doctor.html',
                controller: 'doctorctrl'
            })
            .when('/genqr', {
                templateUrl: 'views/generate_qr.html',
                controller: 'generateqrctrl'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'validationCtrl'
            })
            .when('/detail', {
                templateUrl: 'views/detail.html',
                controller: 'doctorctrl'
            })
            .when('/general-info', {
                templateUrl: 'views/general-information.html',
                controller: 'generalinfoCtrl'
            })
            .when('/past-medical-history', {
                templateUrl: 'views/past-medical-history.html',
                controller: 'pastmedicalctrl'
            })
            .when('/present-medical-history', {
                templateUrl: 'views/present-medical-history.html',
                controller: 'presentmedicalctrl'
            })
            .when('/other-heart-disease-risk-factors', {
                templateUrl: 'views/other-heart-disease-risk-factors.html',
                controller: 'otherinfoctrl'
            });
        $routeProvider.otherwise('/');
        $locationProvider.html5Mode(true);
    }])
    .run(function($rootScope, validateCookie) {
        $rootScope.$on('$routeChangeSuccess', function () {
            validateCookie($rootScope);
        })
    })
    .factory('validateCookie', function($http, $location){
        return function(scope) {
            if($location.path()=='/signup') {
                $location.path("/signup");
            }else{
                if(!localStorage.getItem("logedin")) {
                    $location.path("/");
                }
            }
        }
    })

    .controller('generalinfoCtrl', function ($scope, $http, blockUI, $location) {
        $scope.user = JSON.parse(localStorage.getItem("logedin"));
        $scope.geninfo = {};
        $scope.geninfo.ques = {};
        $scope.geninfo.ques = {
            pheading: "Participant",
            pname: "Name",
            pno: "Mobile Number",
            pdoi: "Date of incorporation",
            paddr: "Address",
            h4: "Family Physician and / or Primary Health Care Provider",
            h4optn1: " Doctor/Other",
            h4optn2: "Mobile Number",
            h4optn3: "Choose City",
            h4addre: "Address ",
            s: "Single",
            m: "Married",
            d: "Divorced",
            w: "Widowed",
            sexm: "Male",
            sexf: "Female",
            gradeschool: "Grade School",
            jrschool: "Jr. High Schoo",
            highscool: "High School",
            phques: "May I send a copy of your consultation to your physician or primary health care provider and consult with them as necessary?: ",
            college: "College (2-4 years) ",
            grad: "Graduate School",
            degree: "Degree",
            purpose: "What is (are) your purpose (s) for participation in this Fitness Program?",
            purposeans1: "To determine my current level of physical fitness and to receive recommendations for an exercise program.",
            purposeans2: "Other (please explain) ",
            ocuheading: "Occupation ",
            ocpos: "Position ",
            ocemp: "Employer",
            ocuphn: "Contact Number",
            occaddr: "Address ",
        }

        $scope.logout = function (str) {
            window.localStorage.clear();
            $location.path("/");
        }
        $scope.setString = function (str) {
            var data = {
                str: str,
                id: $scope.user[0].blockchain_id,
                index:0
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post('http://localhost:7000/wallet/setString', data, config)
                .then(function successCallback(resp) {
                    $location.path("/dashboard");
                }, function errorCallback(resp) {
                    window.alert(resp);
                });
        }
        $scope.getStringByuser = function () {
            var data = {
                id: $scope.user[0].blockchain_id,
                index:0
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post('http://localhost:7000/wallet/getStringByuser', data, config)
                .then(function successCallback(resp) {
                    if(resp.data) {
                        $scope.geninfo = JSON.parse(resp.data.data);
                    }
                }, function errorCallback(resp) {
                    console.log('error');
                });
        }
        $scope.getStringByuser();
        $scope.saveData = function (gi) {
            var string1 = JSON.stringify(gi);
            $scope.setString(string1);
        }
    })
    .controller('pastmedicalctrl', function ($scope, $http, blockUI, $location) {
        $scope.user = JSON.parse(localStorage.getItem("logedin"));
        $scope.pastinfo = {};
        $scope.pastinfo.ans = {};
        $scope.pastinfo.ques = {};
        $scope.pastinfo.ques = {
            heartattack: "Heart attack if so, how many years ago? ",
            rhfever: "Rheumatic Fever",
            heartmu: "Heart murmur",
            doa: "Diseases of the arteries",
            vv: "Varicose veins",
            aol: "Arthritis of legs or arms",
            doabt: " Diabetes or abnormal blood-sugar tests",
            Phlebitis: "Phlebitis (inflammation of a vein)",
            Dizziness: "Dizziness or fainting spells",
            Epilepsy: "Epilepsy or seizures ",
            s: "Stroke",
            d: "Diphtheria",
            SF: "Scarlet Fever",
            Im: "Infectious mononucleosis",
            noep: "Nervous or emotional problems",
            Anemia: "Anemia",
            Thyroid: "Thyroid problems",
            Pneumonia: "Pneumonia",
            Bronchitis: "Bronchitis",
            Asthma: "Asthma",
            abnormalx: "Abnormal chest X-ray ",
            old: "Other lung disease",
            itbalj: "Injuries to back, arms, legs or joint",
            bb: "Broken bones",
            Jaundice: "Jaundice or gall bladder problems",
            Laser: "Laser treatment or other eye surgery?",
            ques: "Have you or your blood relatives had any of the following (include grandparents, aunts and uncles, but exclude cousins, relatives by marriage and half-relatives)? Check those to which the answer is yes (leave other blank) ",
            ques1: " Heart attacks under age 50 ",
            ques2: "Strokes under age 50",
            ques3: "High blood pressure",
            ques4: "Elevated cholesterol ",
            ques5: " Diabetes ",
            ques6: "Asthma or hay fever",
            ques7: "Congenital heart disease (existing at birth but not hereditary)",
            ques8: "Heart operations",
            ques9: " Glaucoma ",
            ques10: "Obesity (20 or more pounds overweight)",
            ques11: "Leukemia or cancer under age 60",
        }

        $scope.logout = function (str) {
            window.localStorage.clear();
            $location.path("/");
        }

        $scope.setString = function (str) {
            var data = {
                str: str,
                id: $scope.user[0].blockchain_id,
                index:1
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post('http://localhost:7000/wallet/setString', data, config)
            .then(function successCallback(resp) {
                $location.path("/dashboard");
            }, function errorCallback(resp) {
                window.alert(resp);
            });
        }
        $scope.getStringByuser = function () {
            var data = {
                id: $scope.user[0].blockchain_id,
                index:1
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post('http://localhost:7000/wallet/getStringByuser', data, config)
                .then(function successCallback(resp) {
                    if(resp.data) {
                        $scope.pastinfo = JSON.parse(resp.data.data);
                    }
                }, function errorCallback(resp) {
                    console.log('error');
                });
        }
        $scope.getStringByuser();
        $scope.saveData = function (gi) {
            var string1 = JSON.stringify(gi);
            $scope.setString(string1);
        }
    })
    .controller('otherinfoctrl', function ($scope, $http, blockUI, $location) {
        $scope.user = JSON.parse(localStorage.getItem("logedin"));
        $scope.otheinfo = {};
        $scope.otheinfo.ans = {};
        $scope.otheinfo.ques = {};
        $scope.otheinfo.ques = {
            smoke: "Have you ever smoked cigarettes, cigars or a pipe?",
            noc: "If you did or now smoke cigarettes, how many per day?",
            nocig: "If you did or now smoke cigars, how many per day?",
            nop: "If you did or now smoke a pipe, how many pipefuls a day? ",
            nod: "If you have stopped smoking, when was it? ",
            hmd: "If you now smoke, how long ago did you start?",
            gw: " What do you consider a good weight for yourself?",
            mw: "What is the most you have ever weighed (including when pregnant)?",
            age: "How old were you?",
            cw: "My current weight is. ",
        }

        $scope.logout = function (str) {
            window.localStorage.clear();
            $location.path("/");
        }

        $scope.setString = function (str) {
            var data = {
                str: str,
                id: $scope.user[0].blockchain_id,
                index:2
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post('http://localhost:7000/wallet/setString', data, config)
            .then(function successCallback(resp) {
                $location.path("/dashboard");
            }, function errorCallback(resp) {
                window.alert(resp);
            });
        }
        $scope.getStringByuser = function () {
            var data = {
                id: $scope.user[0].blockchain_id,
                index:2
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post('http://localhost:7000/wallet/getStringByuser', data, config)
                .then(function successCallback(resp) {
                    if(resp.data) {
                        $scope.otheinfo = JSON.parse(resp.data.data);
                    }
                }, function errorCallback(resp) {
                    console.log('error');
                });
        }
        $scope.getStringByuser();
        $scope.saveData = function (gi) {
            var string1 = JSON.stringify(gi);
            $scope.setString(string1);
        }
    })
    .controller('presentmedicalctrl', function ($scope, $http, blockUI, $location) {
        $scope.user = JSON.parse(localStorage.getItem("logedin"));
        $scope.presentinfo = {};
        $scope.presentinfo.ques = {};
        $scope.presentinfo.ans = {};
        $scope.presentinfo.ques = {
            one: "Has a doctor ever said your blood pressure was too high?",
            two: "Do you ever have pain in your chest or heart?",
            three: "Are you often bothered by a thumping of the heart?",
            four: "Does your heart often race?",
            five: "Do you ever notice extra heartbeats or skipped beats?",
            six: "Are your ankles often badly swollen?",
            seven: " Do cold hands or feet trouble you even in hot weather?",
            eight: "Has a doctor ever said that you have or have had heart trouble, an abnormal electrocardiogram (ECG or EKG), heart attack or coronary?",
            nine: "Do you suffer from frequent cramps in your legs?",
            ten: "Do you often have difficulty breathing? ",
            eleven: "Do you get out of breath long before anyone else?",
            twelve: "Do you sometimes get out of breath when sitting still or sleeping?",
            thirteen: "Has a doctor ever told you your cholesterol level was high?",
            fourteen: "Has a doctor ever told you that you have an abdominal aortic aneurysm?",
            fifteen: "Has a doctor ever told you that you have critical aortic stenosis?",
            sixteen: " Has a doctor ever said your blood pressure was too high?",
            seventeen: "Chronic, recurrent or morning cough?",
            eighteen: "Episode of coughing up blood?",
            nineteen: "Increased anxiety or depression?",
            twenty: "Problems with recurrent fatigue, trouble sleeping or increased irritability? ",
            twentyone: "Migraine or recurrent headaches? ",
            twentytwo: "Swollen or painful knees or ankles?",
            twentythree: "Swollen, stiff or painful joints?",
            twentyfour: "Pain in your legs after walking short distances?",
            twentyfive: "Foot problems?",
            twentysix: "Back problems?",
            twentyseven: "Stomach or intestinal problems, such as recurrent heartburn, ulcers, constipation or diarrhea? ",
            twentyeight: "Significant vision or hearing problems? ",
            twentynine: "Recent change in a wart or a mole?",
            thirty: "Glaucoma or increased pressure in the eyes?",
            thirtyone: "Exposure to loud noises for long periods?",
            thirtytwo: "An infection such as pneumonia accompanied by a fever? ",
            thirtythree: "Significant unexplained weight loss?",
            thirtyfour: "A fever, which can cause dehydration and rapid heartbeat?",
            thirtyfive: "A deep vein thrombosis (blood clot)?",
        }

        $scope.logout = function (str) {
            window.localStorage.clear();
            $location.path("/");
        }

        $scope.setString = function (str) {
            var data = {
                str: str,
                id: $scope.user[0].blockchain_id,
                index:3
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post('http://localhost:7000/wallet/setString', data, config)
            .then(function successCallback(resp) {
                $location.path("/dashboard");
            }, function errorCallback(resp) {
                window.alert(resp);
            });
        }
        $scope.getStringByuser = function () {
            var data = {
                id: $scope.user[0].blockchain_id,
                index:3
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post('http://localhost:7000/wallet/getStringByuser', data, config)
                .then(function successCallback(resp) {
                    if(resp.data) {
                        $scope.presentinfo = JSON.parse(resp.data.data);
                    }
                }, function errorCallback(resp) {
                    console.log('error');
                });
        }
        $scope.getStringByuser();
        $scope.saveData = function (gi) {
            var string1 = JSON.stringify(gi);
            $scope.setString(string1);
        }
    })
    .controller('validationCtrl', function ($scope, $http, $location, blockUI) {

        $scope.logout = function (str) {
            window.localStorage.clear();
            $location.path("/");
        }

        $scope.login = function (result) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post('http://localhost:7000/wallet/login', result, config)
                .then(function successCallback(resp) {
                    if (resp.data.status == 200) {
                        window.localStorage.setItem('logedin', JSON.stringify(resp.data.res));
                        if (resp.data.res[0].type == 1) {
                            $location.path("/dashboard");
                        } else {
                            $location.path("/doctor");
                        }
                    }
                }, function errorCallback(resp) {
                    console.log('error');
                });
        }

        $scope.signup = function (user) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post('http://localhost:7000/wallet/signup', user, config)
                .then(function successCallback(resp) {
                    if (resp.status == 200) {
                        blockUI.stop();
                        $location.path("/");
                    }
                }, function errorCallback(resp) {
                    blockUI.stop();
                    window.alert(resp);
                });
        }
    })
    .controller('generateqrctrl', function ($scope, $http, $location, blockUI) {

        $scope.logout = function (str) {
            window.localStorage.clear();
            $location.path("/");
        }

        $scope.user = JSON.parse(localStorage.getItem("logedin"));
        $scope.genQr = function (temp) {
            temp.b_id = $scope.user[0].blockchain_id;
            temp.id = $scope.user[0].id;
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post('http://localhost:7000/wallet/generateQR', temp, config)
                .then(function successCallback(resp) {
                    if (resp.data.status == 200) {
                        $location.path("/dashboard");
                    }
                }, function errorCallback(resp) {
                    console.log('error');
                });
        }
    })
    .controller('doctorctrl', function ($scope, $http, $location, blockUI) {
        $scope.geninfo = {};
        $scope.pastinfo = {};
        $scope.otheinfo = {};
        $scope.presentinfo = {};
        $scope.logout = function (str) {
            window.localStorage.clear();
            $location.path("/");
        }
        $scope.getdata = function (qr) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post('http://localhost:7000/wallet/getString', {qrhash:qr}, config)
            .then(function successCallback(resp) {
               if(resp.data.d1) {
                $scope.geninfo = JSON.parse(resp.data.d1);
               }if(resp.data.d2) {
                $scope.presentinfo = JSON.parse(resp.data.d2);
               }if(resp.data.d3) {
                $scope.pastinfo = JSON.parse(resp.data.d3);
               }if(resp.data.d4) {
                $scope.otheinfo = JSON.parse(resp.data.d4);
               }
               $location.path("/detail");
            }, function errorCallback(resp) {
                console.log('error');
            });
        }
    });