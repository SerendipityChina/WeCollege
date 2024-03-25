/**
 * Notes: 收藏模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-05-24 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const FavModel = require('../model/fav_model.js');

class FavService extends BaseProjectService {

	/** 是否收藏 */
	async isFav(userId, oid, type) {
		type = String(type);

		let PREFIX = type.toUpperCase();
		let name = type.toLowerCase();

		let Model = require('../model/' + name + '_model.js')

		let model = await Model.getOne(oid, PREFIX + '_FAV_LIST');
		if (!model) return { isFav: 0 };

		let arr = model[PREFIX + '_FAV_LIST'];
		return { isFav: arr.includes(userId) ? 1 : 0 };
	}

	/**
	 * 更新某人收藏
	 * @param {*} userId 
	 * @param {*} oid 
	 * @param {*} cancelIfExist  已收藏的情况下是否取消
	 */
	async updateFav(userId, oid, type) {
		type = String(type);

		let PREFIX = type.toUpperCase();
		let name = type.toLowerCase();

		let Model = require('../model/' + name + '_model.js')
		let model = await Model.getOne(oid, PREFIX + '_FAV_LIST');
		if (!model) return { isFav: 0 };

		let arr = model[PREFIX + '_FAV_LIST'];
		let flag = 0;
		if (arr.includes(userId)) {
			arr = arr.filter(item => item != userId);
			flag = 0;
		}
		else {
			arr.push(userId);
			flag = 1;
		}
		await Model.edit(oid, {
			[PREFIX + '_FAV_LIST']: arr,
			[PREFIX + '_FAV_CNT']: arr.length
		});

		return { isFav: flag };

	}

	/** 删除收藏 */
	async delFav(userId, oid) {
		let where = {
			FAV_OID: oid,
			FAV_USER_ID: userId
		}
		let effect = await FavModel.del(where);

		return {
			effect
		};
	}

	/** 我的收藏列表 */
	async getMyFavList(userId, {
		search, // 搜索条件 
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序  
		page,
		size,
		isTotal = true,
		oldTotal = 0
	}) {
		orderBy = orderBy || {
			'FAV_ADD_TIME': 'desc'
		};
		let fields = 'FAV_TITLE,FAV_ADD_TIME,FAV_OID,FAV_TYPE,FAV_PATH';

		let where = {};
		if (util.isDefined(search) && search) {
			where.FAV_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		}
		where.FAV_USER_ID = userId;

		return await FavModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);

	}

}

module.exports = FavService;