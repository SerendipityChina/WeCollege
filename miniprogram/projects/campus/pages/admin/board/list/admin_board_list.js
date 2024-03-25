const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const BoardBiz = require('../../../../biz/board_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');

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

		//设置搜索菜单
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
	onShow: async function () { },

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

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	_setSort: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = e.currentTarget.dataset.id;
		let sort = e.currentTarget.dataset.sort;
		if (!id) return;

		let params = {
			id,
			sort
		}

		try {
			await cloudHelper.callCloudSumbit('admin/board_sort', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'BOARD_ORDER', sort);
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_del: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/board_del', params, opts).then(res => {
					pageHelper.delListNode(id, this.data.dataList.list, '_id');
					this.data.dataList.total--;
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认删除？删除不可恢复', callback);

	},

	bindMoreTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let idx = pageHelper.dataset(e, 'idx');

		let order = this.data.dataList.list[idx].BOARD_ORDER;
		let orderDesc = (order == 0) ? '取消置顶' : '置顶';


		let itemList = [orderDesc];

		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) { 
					case 0: { //置顶 
						let sort = (order == 0) ? 9999 : 0;
						e.currentTarget.dataset['sort'] = sort;
						await this._setSort(e);
						break;
					}

				}


			},
			fail: function (res) { }
		})
	},

	bindStatusMoreTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let itemList = ['设为公开', '设为仅本人可见', '删除'];
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: {
						e.currentTarget.dataset['status'] = 1;
						await this._setStatus(e);
						break;
					}
					case 1: {
						e.currentTarget.dataset['status'] = 0;
						await this._setStatus(e);
						break;
					}
					case 2: { //删除
						await this._del(e);
						break;
					}

				}


			},
			fail: function (res) { }
		})
	},


	_setStatus: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');
		let status = Number(pageHelper.dataset(e, 'status'));
		let params = {
			id,
			status
		}

		try {
			await cloudHelper.callCloudSumbit('admin/board_status', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'BOARD_STATUS', status, '_id');
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: function () {
		let cateIdOptions = BoardBiz.getCateList();

		let sortItems = [];
		if (cateIdOptions.length > 1) {
			let sortItem1 = [{ label: '分类', type: '', value: 0 }];
			sortItem1 = sortItem1.concat(cateIdOptions);
			sortItems = [sortItem1];
		}

		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '公开', type: 'status', value: 1 },
			{ label: '本人可见', type: 'status', value: 0 },
			{ label: '置顶', type: 'top', value: 'top' },
			{ label: '最早ˇ', type: 'sort', value: 'BOARD_ADD_TIME|asc' },
			{ label: '点赞数ˇ', type: 'sort', value: 'BOARD_LIKE_CNT|desc' },
			{ label: '评论数ˇ', type: 'sort', value: 'BOARD_VIEW_CNT|desc' },
			{ label: '收藏数ˇ', type: 'sort', value: 'BOARD_FAV_CNT|desc' },

		];

		this.setData({
			search: '',
			cateIdOptions,
			sortItems,
			sortMenus,
			isLoad: true
		})


	}

})