let behavior = require('../../../biz/project_index_bh.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const LeaveBiz = require('../../../biz/leave_biz.js');

Page({

	behaviors: [behavior],

	/**
	 * 页面的初始数据
	 */
	data: {
		type: 'leave'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this._onLoad(options);
	},

	bindMyTap: function (e) {
		let itemList = ['我的发布', '我的点赞', '我的收藏']; 
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: {
						this._setMy(this, '我的发布');
						break;
					}
					case 1: {
						this._setMy(this, '我的点赞');
						break;
					}
					case 2: {
						this._setMy(this, '我的收藏');
						break;
					}
				}
			},
			fail: function (err) { }
		})
	},

	bindStatusTap: function (e) {
		let itemList = ['设为出售中', '设为已售出'];
		let id = pageHelper.dataset(e, 'id');
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //启用 
						await this._setStatus(id, 1);
						break;
					}
					case 1: { //不展示 
						await this._setStatus(id, 0);
						break;
					}
				}
			},
			fail: function (err) { }
		})
	},

	_getSearchMenu: function () {

		let sortItem1 = [
			{ label: '分类', type: 'cateId', value: '' }
		];

		if (LeaveBiz.getCateList().length > 1)
			sortItem1 = sortItem1.concat(LeaveBiz.getCateList());

		let sortMenus = [{ label: '全部', type: 'all', value: '' }];



		sortMenus = sortMenus.concat([
			{ label: '出售中', type: 'status', value: '1' },
			{ label: '已售出', type: 'status', value: '0' },
			{ label: '最早ˇ', type: 'sort', value: 'LEAVE_ADD_TIME|asc' },
			{ label: '点赞数ˇ', type: 'like', value: '' },
			{ label: '收藏数ˇ', type: 'fav', value: '' },
		]);



		this.setData({
			isLoad: true,
			sortItems: [sortItem1],
			sortMenus
		})

	},
})