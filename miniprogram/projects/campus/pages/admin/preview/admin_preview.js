const AdminBiz = require('../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		if (!pageHelper.getOptions(this, options, 'type')) return;
		if (!pageHelper.getOptions(this, options, 'id')) return;

		await this._loadDetail();
	},


	_loadDetail: async function () {
		if (!AdminBiz.isAdmin(this)) return;
		let type = this.data.type;

		let params = {
			id: this.data.id
		};
		let opt = {
			title: 'bar'
		};
		let detail = await cloudHelper.callCloudData('admin/' + type + '_detail', params, opt);
		if (!detail) {
			this.setData({
				isLoad: null
			})
			return;
		};

		let forms = detail[type.toUpperCase() + '_FORMS'];
		forms.unshift({
			title: '分类',
			val: detail[type.toUpperCase() + '_CATE_NAME']
		});

		this.setData({
			isLoad: true,
			forms
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () { },

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () { },

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	url: function (e) {
		pageHelper.url(e, this);
	},

	bindSaveTap: function (e) {
		let formContent = this.selectComponent("#contentEditor").getNodeList();

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		parent.setData({
			formContent
		}, () => {
			parent._setContentDesc();
		});

		wx.navigateBack();
	}
})