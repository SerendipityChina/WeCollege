const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this);

		if (!pageHelper.getOptions(this, options)) return;

		this._loadDetail();

	},

	_loadDetail: async function () {
		let id = this.data.id;
		if (!id) return;

		let params = {
			id,
		};
		let opt = {
			title: 'bar'
		};
		let leave = await cloudHelper.callCloudData('leave/view', params, opt);
		if (!leave) {
			this.setData({
				isLoad: null
			})
			return;
		}

		this.setData({
			isLoad: true,
			leave,
		});

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	url: function (e) {
		pageHelper.url(e, this);
	},

	onPageScroll: function (e) {
		// 回页首按钮
		pageHelper.showTopBtn(e, this);

	},

	bindLikeTap: async function (e) {
		if (!await PassportBiz.loginMustBackWin(this)) return;

		let id = this.data.id;
		let leave = this.data.leave;

		try {

			let params = {
				id
			}
			let options = {
				title: leave.like ? '点赞取消中' : '点赞中'
			}
			await cloudHelper.callCloudSumbit('leave/like', params, options).then(res => {
				if (res.data === true) {
					leave.like = true;
					leave.LEAVE_LIKE_CNT++;
					this.setData({ leave });
					pageHelper.showSuccToast('点赞成功');
				}
				else {
					leave.like = false;
					leave.LEAVE_LIKE_CNT--;
					if (leave.LEAVE_LIKE_CNT < 0) leave.LEAVE_LIKE_CNT = 0;
					this.setData({ leave });
					pageHelper.showSuccToast('已取消');
				}

			});
		}
		catch (err) {
			console.error(err);
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		return {
			title: this.data.leave.LEAVE_TITLE,
			imageUrl: this.data.leave.LEAVE_PIC[0]
		}
	}
})