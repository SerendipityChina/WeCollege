const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		isAdmin: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		ProjectBiz.initPage(this);

		if (!pageHelper.getOptions(this, options)) return;
		if (!pageHelper.getOptions(this, options, 'type')) return;

		this.setData({
			nowUserId: PassportBiz.getUserId(),
			_params: { oid: this.data.id },
		});

		if (options && options.source && options.source == 'admin') {
			wx.setNavigationBarColor({ //顶部
				backgroundColor: '#2499f2',
				frontColor: '#ffffff',
			});
			wx.setNavigationBarTitle({
				title: '后台评论管理',
			});
			this.setData({ isAdmin: true });
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

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	bindLikeTap: async function (e) {
		let idx = pageHelper.dataset(e, 'idx');
		let id = pageHelper.dataset(e, 'id');
		let list = this.data.dataList.list;

		try {

			let params = {
				id
			}
			let options = {
				title: list[idx].like ? '点赞取消中' : '点赞中'
			}
			await cloudHelper.callCloudSumbit('comment/like', params, options).then(res => {
				if (res.data === true) {
					list[idx].like = true;
					list[idx]['COMMENT_LIKE_CNT']++;
					this.setData({ 'dataList.list': list });
					pageHelper.showSuccToast('点赞成功');
				}
				else {
					list[idx].like = false;
					list[idx]['COMMENT_LIKE_CNT']--;
					if (list[idx]['COMMENT_LIKE_CNT'] < 0) list[idx]['COMMENT_LIKE_CNT'] = 0;
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

		let commentId = pageHelper.dataset(e, 'id');
		let cb = async () => {
			try {
				let params = {
					type: this.data.type,
					id: commentId,
					isAdmin: this.data.isAdmin
				}
				let opts = {
					title: '删除中'
				}

				await cloudHelper.callCloudSumbit('comment/del', params, opts).then(res => {
					let callback = () => {
						pageHelper.delListNode(commentId, this.data.dataList.list, '_id');
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

	_getSearchMenu: function () {

		let sortItem1 = [

		];

		let sortMenus = [
			{ label: '全部', type: 'all', value: '' },
			{ label: '最早ˇ', type: 'sort', value: 'COMMENT_ADD_TIME|asc' },
			{ label: '点赞数ˇ', type: 'like', value: '' },
			{ label: '我的评论', type: 'mycomment', value: '' },
			{ label: '我的点赞', type: 'mylike', value: '' },
		];

		if (this.data.isAdmin) {
			sortMenus = [
				{ label: '全部', type: 'all', value: '' },
				{ label: '最早ˇ', type: 'sort', value: 'COMMENT_ADD_TIME|asc' },
				{ label: '点赞数ˇ', type: 'like', value: '' } 
			];
		}

		this.setData({
			isLoad: true,
			sortItems: [],
			sortMenus
		})

	},
})