"use strict";
angular.module('craditKartApp')
  .config(
    ['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {

          $urlRouterProvider
            .otherwise('/home');

          $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })

               .state('Login', {
                   url: '/Login',
                   templateUrl: 'views/particle/Login.html',
                   controller: 'AuthCtrl'
               })

                 .state('Registarion', {
                     url: '/Registarion',
                     templateUrl: 'views/particle/registration.html',
                     controller: 'AuthCtrl',
                     params: { loginParams: null }
                 })

            //For user type borrower
            .state('borrower', {
                url: '/borrower',
                abstract: true,
                template: '<div ui-view/>',
                data: {
                    authorize: {
                        user_type: ['borrower', 'operator', 'KC manager', 'channel partner']
                    },
                    authenticate: true
                }
            })
            .state('borrower.profile', {
                url: '/profile',
                templateUrl: 'views/borrower/profile.html',
                controller: 'BorrowerProfileCtrl'
            })
            //start application form
            .state('borrower.application', {
                url: '/application',
                templateUrl: 'views/borrower/application.html',
                abstract: true,
                controller: 'ApplicationCtrl'
            })
            .state('borrower.application.loan_details', {
                url: '/loan_details/:productId/:Id',
                templateUrl: 'views/borrower/application_forms/loan_details.html'
            })
            .state('borrower.application.personal_details', {
                url: '/personal_details/:productId/:Id',
                templateUrl: 'views/borrower/application_forms/personal_details.html',
                controller: 'application_personal_detail'
            })
            .state('borrower.application.employer_details', {
                url: '/employer_details/:productId/:Id',
                templateUrl: 'views/borrower/application_forms/employer_details.html'
            })
            .state('borrower.application.business_details', {
                url: '/business_details/:productId/:Id',
                templateUrl: 'views/borrower/application_forms/business_details.html',
                controller: 'application_business_detail'
            })
            .state('borrower.application.partner_details', {
                url: '/partner_details/:productId/:Id',
                templateUrl: 'views/borrower/application_forms/partner_details.html'
            })
            .state('borrower.application.references', {
                url: '/references/:productId/:Id',
                templateUrl: 'views/borrower/application_forms/references.html',
                controller: "application_references"
            })
            .state('borrower.application.uploads', {
                url: '/uploads/:productId/:Id',
                templateUrl: 'views/borrower/application_forms/uploads.html',
                controller: 'application_document'
            })

            //For application
            .state('application', {
                url: '/application',
                abstract: true,
                template: '<div ui-view/>'
            })
            .state('application.survey', {
                url: '/survey/:id',
                templateUrl: 'views/borrower/application_forms/survey.html',
                data: {
                    authorize: {
                        user_type: ['borrower']
                    },
                    authenticate: true
                },
                controller: 'ApplicationCtrl'
            })
            .state('application.review', {
                url: '/review',
                templateUrl: 'views/borrower/review.html',
                controller: 'ReviewCtrl',
                data: {
                    authorize: {
                        user_type: ['super admin', 'operator', 'lender', 'KC manager', 'channel partner']
                    },
                    authenticate: true
                }
            })
            .state('application.review.loan_details', {
                url: '/loan_details/:id',
                templateUrl: 'views/borrower/review_pages/loan_details.html',
                title: 'Review loan details'
            })
            .state('application.review.personal_details', {
                url: '/personal_details/:id',
                templateUrl: 'views/borrower/review_pages/personal_details.html',
                title: 'Review personal details'
            })
            .state('application.review.employer_details', {
                url: '/employer_details/:id',
                templateUrl: 'views/borrower/review_pages/employer_details.html',
                title: 'Review employer details'
            })
            .state('application.review.business_details', {
                url: '/business_details/:id',
                templateUrl: 'views/borrower/review_pages/business_details.html',
                title: 'Review business details'
            })
            .state('application.review.partner_details', {
                url: '/partner_details/:id',
                templateUrl: 'views/borrower/review_pages/partner_details.html',
                title: 'Review partner details'
            })
            .state('application.review.references', {
                url: '/references/:id',
                templateUrl: 'views/borrower/review_pages/references.html',
                title: 'Review references'
            })
            .state('application.review.documents', {
                url: '/documents/:id',
                templateUrl: 'views/borrower/review_pages/documents.html',
                title: 'Review documents'
            })

            //borrower dashboard
            .state('borrower.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/borrower/borrower-dashboard.html',
                abstract: true,
                controller: 'BorrowerDashboardCtrl'
            })
            .state('borrower.dashboard.home', {
                url: '/home',
                templateUrl: 'views/borrower/borrower_dashboard_pages/home.html',
                controller: 'BorrowerDashboardCtrl'

            })
            .state('borrower.dashboard.applications', {
                url: '/applications',
                templateUrl: 'views/borrower/borrower_dashboard_pages/applications.html',
                controller: 'borrower_loanApplications'
            })
            .state('borrower.dashboard.loans', {
                url: '/loans',
                templateUrl: 'views/borrower/borrower_dashboard_pages/loans.html',
                controller: 'borrower_loan'
            })
              .state('borrower.dashboard.loan_details', {
                  url: '/loan_details/:id',
                  templateUrl: 'views/borrower/borrower_dashboard_pages/loan_details.html'
              })
            .state('borrower.dashboard.refers', {
                url: '/refers',
                templateUrl: 'views/borrower/borrower_dashboard_pages/refers.html'
            })
            .state('borrower.dashboard.faq', {
                url: '/faq',
                templateUrl: 'views/borrower/borrower_dashboard_pages/faq.html'
            })

            //==================For user type "lender"=======================================
            .state('lender', {
                url: '/lender',
                abstract: true,
                template: '<div ui-view/>'
            })
            .state('lender.login', {
                url: '/login',
                templateUrl: 'views/lender/lender-login.html',
                controller: 'LenderAuthCtrl',
                data: {
                    authenticate: false,
                    hideHeader: true,
                    hideFooter: true
                }
            })
            .state('lender.register', {
                url: '/register',
                templateUrl: 'views/lender/lender-register.html',
                controller: 'LenderAuthCtrl',
                data: {
                    authenticate: false,
                    hideHeader: true,
                    hideFooter: true
                }
            })
            .state('lender.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/lender/lender-dashboard.html',
                data: {
                    authorize: {
                        user_type: ['lender']
                    },
                    authenticate: true,
                    environment: 'lender'
                },
                controller: 'LenderDashboardCtrl'
            })
            .state('lender.profile', {
                url: '/profile',
                controller: 'LenderProfileCtrl',
                templateUrl: 'views/lender/profile.html',
                data: {
                    authorize: {
                        user_type: ['lender']
                    },
                    authenticate: true
                }
            })

            //===================For user type "chanel partner"==============================
            .state('channelPartner', {
                url: '/channel-partner',
                abstract: true,
                template: '<div ui-view/>'
            })
            .state('channelPartner.login', {
                url: '/login',
                templateUrl: 'views/channelPartner/channel-partner-login.html',
                controller: 'ChannelPartnerAuthCtrl',
                data: {
                    authenticate: false,
                    hideHeader: true,
                    hideFooter: true
                }
            })
            .state('channelPartner.register', {
                url: '/register',
                templateUrl: 'views/channelPartner/channel-partner-register.html',
                controller: 'ChannelPartnerAuthCtrl',
                data: {
                    authenticate: false,
                    hideHeader: true,
                    hideFooter: true
                }
            })

            //channel partner profile
            .state('channelPartner.profile', {
                url: '/profile',
                templateUrl: 'views/channelPartner/profile.html',
                controller: 'ChannelPartnerProfileCtrl',
                data: {
                    authorize: {
                        user_type: ['channel partner']
                    },
                    authenticate: true
                }
            })

            //channel partner dashboard
            .state('channelPartner.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/channelPartner/channel-partner-dashboard.html',
                abstract: true,
                data: {
                    authorize: {
                        user_type: ['channel partner']
                    },
                    authenticate: true
                }
            })
            .state('channelPartner.dashboard.home', {
                url: '/home',
                templateUrl: 'views/channelPartner/channel_partner_dashboard_pages/home.html',
                controller: 'ChannelPartnerDashboardCtrl'
            })
            .state('channelPartner.dashboard.kreditcartApplications', {
                url: '/kreditcart-applications',
                templateUrl: 'views/channelPartner/channel_partner_dashboard_pages/kreditcart-applications.html',
                controller: 'ChannelPartnerDashboardCtrl'
            })
            .state('channelPartner.dashboard.myApplications', {
                url: '/my-applications',
                templateUrl: 'views/channelPartner/channel_partner_dashboard_pages/my-applications.html',
                controller: 'ChannelPartnerMyApplicationCtrl'
            })
            .state('channelPartner.dashboard.loans', {
                url: '/loans',
                templateUrl: 'views/channelPartner/channel_partner_dashboard_pages/loans.html',
                controller: 'ChannelPartnerDashboardCtrl'
            })
            .state('channelPartner.dashboard.leads', {
                url: '/leads',
                templateUrl: 'views/channelPartner/channel_partner_dashboard_pages/leads.html',
                controller: 'ChannelPartnerDashboardCtrl'
            })

            //=====================For user type "operator"====================================
            .state('operator', {
                url: '/operator',
                abstract: true,
                template: '<div ui-view/>',
                data: {
                    authorize: {
                        user_type: ['operator', 'KC manager']
                    },
                    authenticate: true
                }
            })
            .state('operator.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/operator/operator-dashboard.html',
                controller: 'OperatorCtrl'
            })
            .state('operator.applications', {
                url: '/applications',
                templateUrl: 'views/operator/application-list.html',
                controller: 'OperatorCtrl'
            })
            .state('operator.applicationScore', {
                url: '/application/:id',
                templateUrl: 'views/operator/application-score.html',
                controller: 'OperatorCtrl',
                title: 'Add/Edit application score'
            })
            .state('operator.profile', {
                url: '/profile',
                templateUrl: 'views/operator/profile.html',
                controller: 'OperatorProfileCtrl'
            })

            //==================For user type super admin============================
            .state('superAdmin', {
                url: '/super-admin',
                abstract: true,
                template: '<div ui-view/>',
                data: {
                    authorize: {
                        user_type: ['super admin']
                    },
                    authenticate: true
                }
            })
            .state('superAdmin.calculators', {
                url: '/calculators',
                templateUrl: 'views/super-admin/product-list.html',
                controller: 'SuperAdminCtrl'
            })
            .state('superAdmin.score-card', {
                url: '/calculators/:calculatorId',
                templateUrl: 'views/super-admin/score-card.html',
                controller: 'SuperAdminCtrl'
            })
            .state('superAdmin.scores', {
                url: '/scores/:subTypeId',
                templateUrl: 'views/super-admin/scores.html',
                controller: 'SuperAdminCtrl'
            })
            .state('superAdmin.audits', {
                url: '/audits',
                templateUrl: 'views/super-admin/audits.html',
                controller: 'SuperAdminAuditCtrl'
            })
            .state('superAdmin.lenders', {
                url: '/lenders',
                templateUrl: 'views/super-admin/lenders_list.html',
                controller: 'SuperAdminCtrl'
            })
            .state('superAdmin.lender_products', {
                url: '/lenders/:lenderId',
                templateUrl: 'views/super-admin/lender_product_list.html',
                controller: 'LenderProductCtrl'
            })
            //all static pages
            .state('products', {
                url: '/products',
                templateUrl: 'views/static/products.html',
                controller: function ($location, $scope, $anchorScroll) {
                    $scope.init = function () {
                        $anchorScroll($location.hash());
                    }
                    $scope.init();
                },
                controllerAs: 'product'
            })
            .state('aboutUs', {
                url: '/about-us',
                templateUrl: 'views/static/about-us.html',
                controller: function ($location, $scope, $anchorScroll) {
                    $scope.init = function () {
                        $anchorScroll($location.hash());
                    }
                    $scope.init();
                },
                controllerAs: 'about'
            })
            .state('contactUs', {
                url: '/contact',
                templateUrl: 'views/static/contact-us.html',
                controller: 'ContactCtrl'
            })
            .state('team', {
                url: '/team',
                templateUrl: 'views/static/team.html'
            })

		  .state('faq', {
		      url: '/faq',
		      templateUrl: 'views/static/faq.html'
		  });
      }
    ]
  );
