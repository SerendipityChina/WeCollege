module.exports = {
	PID: 'A00', //图书馆

	NAV_COLOR: '#ffffff',
	NAV_BG: '#4284FF',

	MEET_NAME: '活动/预约', 
 
	MENU_ITEM: ['首页', '活动日历', '我的'], // 第1,4,5菜单

	NEWS_CATE: '1=本馆动态,2=新书来了,3=书籍榜单,4=服务指南',
	MEET_TYPE: '1=进馆预约,2=活动讲座',

	DEFAULT_FORMS: [{
			type: 'line',
			title: '姓名',
			desc: '请填写您的姓名',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		},
		{
			type: 'line',
			title: '手机',
			desc: '请填写您的手机号码',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		}
	]
}