const pageHelper = require('../../../helper/page_helper.js');
const cloudHelper = require('../../../helper/cloud_helper.js');
const ProjectBiz = require('./project_biz.js');
const PassportBiz = require('../../../comm/biz/passport_biz.js');

module.exports = Behavior({
	/**
	 * 页面的初始数据
	 */
	data: {
		type: '',

		_params: null,
		isLoad: false,
		isAdmin: false,
		sortMenusDefaultIndex: -1
	},

	methods: {
		_onLoad: async function (options) {
			ProjectBiz.initPage(this);
			await PassportBiz.loginSilence(this);

			this.setData({
				typePrefix: this.data.type.toUpperCase(),
				nowUserId: PassportBiz.getUserId()
			});

			if (options && options.source && options.source == 'admin') {
				this.setData({ isAdmin: true });
			}

			if (options && options.search) {
				this.setData({ search: options.search });
			}

			this._getSearchMenu();

		},


		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function () {

		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function () {
			this.setData({
				sortMenusDefaultIndex: this.data.search ? -1 : 0,
				nowUserId: PassportBiz.getUserId(),
			});
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
		onPullDownRefresh: function () {

		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {

		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function () {

		},

		_setMy: function (that, search) {
			that.setData({
				sortMenusDefaultIndex: -1,
				search,
			})
		},

		url: async function (e) {
			pageHelper.url(e, this);
		},

		bindCommListCmpt: function (e) {
			pageHelper.commListListener(this, e);
		},

		bindPostTap: async function (e) { 
			if (!await PassportBiz.loginMustCancelWin(this)) return;
	 
			wx.navigateTo({
				url: '../add/' + this.data.type + '_add',
			});
		},

		_setStatus: async function (id, status) {
			let params = {
				id,
				status
			}

			try {
				await cloudHelper.callCloudSumbit(this.data.type + '/status', params).then(res => {
					pageHelper.modifyListNode(id, this.data.dataList.list, this.data.typePrefix + '_STATUS', status, '_id');
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('设置成功');
				});
			} catch (e) {
				console.log(e);
			}
		},

		bindLikeTap: async function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let id = pageHelper.dataset(e, 'id');
			let list = this.data.dataList.list;
			let typePrefix = this.data.typePrefix;

			try {

				let params = {
					id
				}
				let options = {
					title: list[idx].like ? '点赞取消中' : '点赞中'
				}
				await cloudHelper.callCloudSumbit(this.data.type + '/like', params, options).then(res => {
					if (res.data === true) {
						list[idx].like = true;
						list[idx][typePrefix + '_LIKE_CNT']++;
						this.setData({ 'dataList.list': list });
						pageHelper.showSuccToast('点赞成功');
					}
					else {
						list[idx].like = false;
						list[idx][typePrefix + '_LIKE_CNT']--;
						if (list[idx][typePrefix + '_LIKE_CNT'] < 0) list[idx][typePrefix + '_LIKE_CNT'] = 0;
						this.setData({ 'dataList.list': list });
						pageHelper.showSuccToast('已取消');
					}

				});
			}
			catch (err) {
				console.error(err);
			}
		},

		bindFavTap: async function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let id = pageHelper.dataset(e, 'id');
			let list = this.data.dataList.list;
			let typePrefix = this.data.typePrefix;

			try {

				let params = {
					oid: id,
					type: this.data.type
				}
				let options = {
					title: list[idx].fav ? '收藏取消中' : '收藏中'
				}
				await cloudHelper.callCloudSumbit('fav/update', params, options).then(res => {
					if (res.data.isFav === 1) {
						list[idx].fav = true;
						list[idx][typePrefix + '_FAV_CNT']++;
						this.setData({ 'dataList.list': list });
						pageHelper.showSuccToast('收藏成功');
					}
					else {
						list[idx].fav = false;
						list[idx][typePrefix + '_FAV_CNT']--;
						if (list[idx][typePrefix + '_FAV_CNT'] < 0) list[idx][typePrefix + '_FAV_CNT'] = 0;
						this.setData({ 'dataList.list': list });
						pageHelper.showSuccToast('已取消');
					}

				});
			}
			catch (err) {
				console.error(err);
			}
		},

		bindDelTap: async function (e) {
			if (!await PassportBiz.loginMustCancelWin(this)) return;

			let id = pageHelper.dataset(e, 'id');
			let cb = async () => {
				try {
					let params = {
						id,
						isAdmin: this.data.isAdmin
					}
					let opts = {
						title: '删除中'
					}

					await cloudHelper.callCloudSumbit(this.data.type + '/del', params, opts).then(res => {
						let callback = () => {
							pageHelper.delListNode(id, this.data.dataList.list, '_id');
							this.data.dataList.total--;
							this.setData({
								dataList: this.data.dataList
							});
						}
						pageHelper.showSuccToast('删除成功', 1500, callback);
					});
				} catch (err) {
					console.log(err);
				}
			}

			pageHelper.showConfirm('确认删除?', cb);
		},

	}
})